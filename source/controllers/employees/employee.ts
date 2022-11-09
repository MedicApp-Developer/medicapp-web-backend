import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import User from '../../models/user'
import makeResponse from '../../functions/makeResponse'
import UserController from '../user'
import { sendSupportEmail } from '../../functions/supportMailer'
import { getRandomPassword } from '../../functions/utilities'
import config from '../../config/config'
import { Pagination } from '../../constants/pagination'
import cloudinary from 'cloudinary'
import Employee from '../../models/employees/employee'

const NAMESPACE = "Employees"

const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, department, salary, emiratesId, passportNo, workEmail } = req.body
    
    // @ts-ignore
    const employeeAgreementFile = req.files['employeeAgreement'][0];
    // @ts-ignore
    const passportPdfFile = req.files['passportPdf'][0];
    // @ts-ignore
    const emiratesIdPdfFile = req.files['emiratesIdPdf'][0];
    // @ts-ignore
    const visaPdfFile = req.files['visaPdf'][0];

    // @ts-ignore
    const profilePicFile = req.files['profilePic'][0];

    // @ts-ignore
    cloudinary.v2.config({
        cloud_name: config.cloudinary.name,
        api_key: config.cloudinary.apiKey,
        api_secret: config.cloudinary.secretKey
    })

    // @ts-ignore
    const employeeAgreementResult = await cloudinary.uploader.upload(employeeAgreementFile.path);
    // @ts-ignore
    const passportPdfFileResult = await cloudinary.uploader.upload(passportPdfFile.path);
    // @ts-ignore
    const emiratesIdPdfFileResult = await cloudinary.uploader.upload(emiratesIdPdfFile.path);
    // @ts-ignore
    const visaPdfFileResult = await cloudinary.uploader.upload(visaPdfFile.path);
    // @ts-ignore
    const profilePicFileResult = await cloudinary.uploader.upload(profilePicFile.path);

    const password = getRandomPassword()

    if (email && name && department && salary && emiratesId && passportNo) {
        await User.find({ email }).then(result => {
            if (result.length === 0) {

                if (email && name && department && salary && passportNo && emiratesId) {
                    const newEmployee = new Employee({
                        _id: new mongoose.Types.ObjectId(),
                        name, email, department, salary, emiratesId, passportNo, workEmail,
                        employeeAgreement: employeeAgreementResult.url,
                        passportPdf: passportPdfFileResult.url,
                        emiratesIdPdf: emiratesIdPdfFileResult.url,
                        visaPdf: visaPdfFileResult.url,
                        profilePic: profilePicFileResult.url
                    })

                    const options = {
                        from: config.mailer.user,
                        to: email,
                        subject: "Welcome to Medicapp",
                        text: `Your account account has been created as an Employee, and your password is ${password}`
                    }

                    sendSupportEmail(options, false)

                    return newEmployee.save()
                        .then(async result => {
                            await UserController.createUserFromEmailAndPassword(req, res, email, password, name, "", emiratesId, department, result._id)
                            return makeResponse(res, 201, "Employee Created Successfully", result, false)
                        })
                        .catch(err => {
                            return makeResponse(res, 400, err.message, null, true)
                        })
                } else {
                    return makeResponse(res, 400, "Validation Failed", null, true)
                }
            } else {
                return makeResponse(res, 400, "Email Already in use", null, true)
            }
        })
    } else {
        return makeResponse(res, 400, "Validation Failed", null, true)
    }
}


const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    // This id is updated doctor itself id 
    const { id } = req.params

    const update = JSON.parse(JSON.stringify({ ...req.body }))

    update.password && delete update.password

    // @ts-ignore
    cloudinary.v2.config({
        cloud_name: config.cloudinary.name,
        api_key: config.cloudinary.apiKey,
        api_secret: config.cloudinary.secretKey
    })

    // @ts-ignore
    if (req.files?.profilePic) {
        // @ts-ignore
        const profilePicFile = req.files['profilePic'][0]; 
        // @ts-ignore
        const profilePicFileResult = await cloudinary.uploader.upload(profilePicFile.path);
        update.profilePic = profilePicFileResult.url;
    }

    // @ts-ignore
    if (req.files?.employeeAgreement) {
        // @ts-ignore
        const employeeAgreementFile = req.files['employeeAgreement'][0]; 
        // @ts-ignore
        const employeeAgreementResult = await cloudinary.uploader.upload(employeeAgreementFile.path);
        update.employeeAgreement = employeeAgreementResult.url;
    }

    // @ts-ignore
    if (req.files?.emiratesIdPdf) {
        // @ts-ignore
        const emiratesIdPdfFile = req.files['emiratesIdPdf'][0]; 
        // @ts-ignore
        const emiratesIdPdfResult = await cloudinary.uploader.upload(emiratesIdPdfFile.path);
        update.emiratesIdPdf = emiratesIdPdfResult.url;
    }

    // @ts-ignore
    if (req.files?.passportPdf) {
        // @ts-ignore
        const passportPdfFile = req.files['passportPdf'][0]; 
        // @ts-ignore
        const passportPdfResult = await cloudinary.uploader.upload(passportPdfFile.path);
        update.passportPdf = passportPdfResult.url;
    }

    // @ts-ignore
    if (req.files?.visaPdf) {
        // @ts-ignore
        const visaPdfFile = req.files['visaPdf'][0]; 
        // @ts-ignore
        const visaPdfResult = await cloudinary.uploader.upload(visaPdfFile.path);
        update.visaPdf = visaPdfResult.url;
    }

    const filter = { _id: id }

    const updatedUser = await UserController.updateEmployeeByCeo(req, res, req.body.email, req.body)
    

    if (updatedUser !== null) {
        Employee.findOneAndUpdate(filter, update, { new: true }).then(updatedEmployee => {
            return makeResponse(res, 200, "Employee updated Successfully", { employee: updatedEmployee }, false)
        }).catch(err => {
            return makeResponse(res, 400, err.message, null, true)
        })
    } else {
        return makeResponse(res, 400, 'Failed to update user', null, true)
    }
}

const getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const page = parseInt(req.query.page || "0")
  if (req.query.getAll !== "undefined") {
        Employee.find({})
            .then(employees => {
                return makeResponse(res, 200, "All Employees", { employees }, false)
            }).catch(err => {
                return makeResponse(res, 400, err.message, null, true)
            })
  } else {
      const total = await Employee.find({}).countDocuments({})
        Employee.find({ })
            .limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page)
            .then(result => {
                return makeResponse(res, 200, "All Employees", { totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), employees: result }, false)
            })
            .catch(err => {
                return makeResponse(res, 400, err.message, null, true)
            })
    }
}

const getSingleEmployee = (req: Request, res: Response, next: NextFunction) => {
    Employee.findById({ _id: req.params.id })
        .then(data => {
            return makeResponse(res, 200, "Employee", data, false)
        }).catch(err => {
            return makeResponse(res, 400, err.message, null, true)
        })
}

const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
  try {
        const employee = await Employee.findByIdAndDelete(_id)
        if (!employee) return res.sendStatus(404)
        await UserController.deleteUserWithEmail(employee.email)
        return makeResponse(res, 200, "Deleted Successfully", employee, false)
    } catch (e) {
        return res.sendStatus(400)
    }
}

const searchEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const { searchedText } = req.params
    // @ts-ignore
    const page = parseInt(req.query.page || "0")

    // Regex 
    const searchedTextRegex = new RegExp(searchedText, 'i')

    const searchQuery = [
        { name: searchedTextRegex },
        { email: searchedTextRegex },
        { department: searchedTextRegex },
        { emiratesId: searchedTextRegex },
        { passportNo: searchedTextRegex },
        { workEmail: searchedTextRegex }
    ]

    const total = await Employee.find({ $or: searchQuery }).countDocuments({})

    Employee.find({ $or: searchQuery }).limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page)
        .then(result => {
            return makeResponse(res, 200, "Search Results", { searchedText, totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), employees: result }, false)
        }).catch(err => {
            return makeResponse(res, 400, "No employees found", null, true)
        })
}

const getAllEmployeesWithDepartment =  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const { page, department } = req.body;
      
    const total = await Employee.find({ department }).countDocuments({})
      Employee.find({ department })
          .limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page)
          .then(result => {
              return makeResponse(res, 200, "All Employees", { totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), employees: result }, false)
          })
          .catch(err => {
              return makeResponse(res, 400, err.message, null, true)
          })

}

export default {
    createEmployee,
    getAllEmployees,
    getSingleEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployee,
    getAllEmployeesWithDepartment
}
