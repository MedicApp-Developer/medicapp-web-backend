import { NextFunction, Request, Response } from 'express'
import EmployeeRequest from '../../models/employees/employeeRequest'
import makeResponse from '../../functions/makeResponse'
import cloudinary from 'cloudinary'
import config from '../../config/config'

const NAMESPACE = "Employee Request"

const createEmployeeRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { type, from, to, reason, employeeId } = req.body

    // @ts-ignore
    cloudinary.v2.config({
        cloud_name: config.cloudinary.name,
        api_key: config.cloudinary.apiKey,
        api_secret: config.cloudinary.secretKey
    })

    // @ts-ignore
    const result1 = await cloudinary.uploader.upload(req.file.path)

    // @ts-ignore
    const newRequest = new EmployeeRequest({ type, from, to, reason, employeeId, leavePdf: result1.url })
    newRequest.save().then(result => {
        return makeResponse(res, 201, "Employee Requests Created Successfully", result, false)
    })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true)
        })
}

const getAllRequestsOfEmployee = (req: Request, res: Response, next: NextFunction) => {
    EmployeeRequest.find({ employeeId: req.params.id })
        .then(result => {
            return makeResponse(res, 200, "All Employee Request", result, false)
        })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true)
        })
}

const getSingleRequest = (req: Request, res: Response, next: NextFunction) => {
    EmployeeRequest.findById({ _id: req.params.id })
        .then(data => {
            return makeResponse(res, 200, "Request", data, false)
        }).catch(err => {
            return makeResponse(res, 400, err.message, null, true)
        })
}

const updateEmployeeRequest = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const filter = { _id: id }
    let update = { ...req.body }

    EmployeeRequest.findOneAndUpdate(filter, update).then(updatedRequest => {
        return makeResponse(res, 200, "Employee request updated Successfully", updatedRequest, false)
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true)
    })
}

const deleteEmployeeCategory = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    try {
        const employeeRequest = await EmployeeRequest.findByIdAndDelete(_id)
        if (!employeeRequest) return res.sendStatus(404)
        return makeResponse(res, 200, "Deleted Successfully", employeeRequest, false)
    } catch (e) {
        return res.sendStatus(400)
    }
}

export default {
    createEmployeeRequest,
    getAllRequestsOfEmployee,
    getSingleRequest,
    updateEmployeeRequest,
    deleteEmployeeCategory
}
