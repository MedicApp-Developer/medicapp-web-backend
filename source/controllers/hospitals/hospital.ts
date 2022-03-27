import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import Hospital from '../../models/hospital/hospital'
import User from '../../models/user'
import makeResponse, { sendErrorResponse } from '../../functions/makeResponse'
import UserController from '../user'
import { Roles, UserStatus } from '../../constants/roles'
import { HospitalType } from '../../constants/hospital'
import config from '../../config/config'
import { uploadsOnlyVideo } from '../../functions/uploadS3'
import { validateHospitalRegisteration } from '../../validation/hospitalRegisteration'
import Doctor from '../../models/doctors/doctor'
import Speciality from '../../models/doctors/speciality'
import { SERVER_ERROR_CODE } from '../../constants/statusCode'
import cloudinary from 'cloudinary'
import Slot from '../../models/doctors/slot'
import path from 'path'
import pdf from 'html-pdf'
import generateHospitalFinanceReport from '../../documents/HospitalFinanceReport'
import { SlotStatus, SlotTypes } from '../../constants/slot'
import { sendEmail } from '../../functions/mailer'

const NAMESPACE = "Hospital"

const createHospital = async (req: Request, res: Response, next: NextFunction) => {
    const { errors, isValid } = validateHospitalRegisteration(req.body)
    // Check validation
    if (!isValid) {
        return makeResponse(res, 400, "Validation Failed", errors, true)
    }

    const { email, phoneNo, password, name, tradeLicenseNo, issueDate, expiryDate, location, address, state, type } = req.body

    await User.find({ email }).then(async (result: any) => {
        if (result.length === 0) {
            // @ts-ignore
            cloudinary.v2.config({
                cloud_name: config.cloudinary.name,
                api_key: config.cloudinary.apiKey,
                api_secret: config.cloudinary.secretKey
            })

            // @ts-ignore
            const result = await cloudinary.uploader.upload(req.file.path)

            const newHospital = new Hospital({
                _id: new mongoose.Types.ObjectId(),
                type, category: null, addons: [], phoneNo, tradeLicenseFile: result.url,
                email, name, tradeLicenseNo, issueDate, expiryDate, address, state,
                location: {
                    "type": "Point",
                    "coordinates": JSON.parse(location)
                }
            })
            const options = {
                from: config.mailer.user,
                to: email,
                subject: "Welcome to Medicapp",
                text: `Your account account has been created as a hospital and status of your account is Pending for now, contact Medicapp Admin to get approved`
            }

            sendEmail(options)
            return newHospital.save()
                .then(async (result: any) => {
                    await UserController.createUserFromEmailAndPassword(req, res, email, password, name, "", "", Roles.HOSPITAL, result._id, UserStatus.PENDING)
                    return makeResponse(res, 201, "Hospital Created Successfully", result, false)

                    // if(){
                    //     return makeResponse(res, 201, "Hospital Created Successfully", result, false);
                    // }else {
                    //     return makeResponse(res, 201, "Something went wrong while creating Hospital", result, false);
                    // };
                })
                .catch((err: any) => {
                    return makeResponse(res, 400, err.message, null, true)
                })
        } else {
            return makeResponse(res, 400, "Email already exists", null, true)
        }
    })
}

const getAllHospitals = (req: Request, res: Response, next: NextFunction) => {
    Hospital.find({ status: UserStatus.APPROVED })
        .then((result: any) => {
            return makeResponse(res, 200, "All Hospitals", result, false)
        })
        .catch((err: any) => {
            return makeResponse(res, 400, err.message, null, true)
        })
}

const getSingleHospital = async (req: Request, res: Response, next: NextFunction) => {
    const doctors = await Doctor.find({ hospitalId: req.params.id }).populate('hospitalId')

    Hospital.findById({ _id: req.params.id, status: UserStatus.APPROVED }).populate("services")
        .then((data: any) => {
            return makeResponse(res, 200, "Hospital", { hospital: data, doctors }, false)
        }).catch((err: any) => {
            return makeResponse(res, 400, err.message, null, true)
        })
}

const getHospitalDetail = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params

    try {
        const hospitalDetail = await Hospital.findById({ _id: id }).populate("services")

        const hospitalDoctors = await Doctor.find({ hospitalId: id }).populate("specialityId")
        const specialities: any = []

        // @ts-ignore
        if (hospitalDoctors?.length !== 0) {
            // @ts-ignore
            hospitalDoctors?.forEach((doctor) => {
                // @ts-ignore
                if (specialities.filter(sp => sp.name_en === doctor?.specialityId?.name_en).length === 0) {
                    // @ts-ignore
                    doctor?.specialityId?.forEach((element: any) => {
                        specialities.push(element)
                    })

                }
            })
        }

        // @ts-ignore
        return makeResponse(res, 200, "Hospital", { hospitalDetail, hospitalDoctors, specialities }, false)

    } catch (err) {
        // @ts-ignore
        return makeResponse(res, 400, err.message, null, true)
    }
}

const updateHospital = (req: Request, res: Response, next: NextFunction) => {
    // This _id is Hospital User ID
    const { _id } = res.locals.jwt

    // This id is updated hospital itself id 
    const { id } = req.params

    const update = JSON.parse(JSON.stringify({ ...req.body }))

    update.password && delete update.password

    const filter = { _id: id }

    UserController.updateUser(req, res, _id, req.body)

    Hospital.findOneAndUpdate(filter, update).then((updatedHospital: any) => {
        return makeResponse(res, 200, "Hospital updated Successfully", updatedHospital, false)
    }).catch((err: any) => {
        return makeResponse(res, 400, err.message, null, true)
    })
}

const deleteHospital = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    try {
        const hospital = await Hospital.findByIdAndDelete(_id)
        if (!hospital) return res.sendStatus(404)
        await UserController.deleteUserWithEmail(hospital.email)
        return makeResponse(res, 200, "Deleted Successfully", Hospital, false)

        // if(){
        //     return makeResponse(res, 200, "Deleted Successfully", Hospital, false);
        // }else {
        //     return makeResponse(res, 400, "Error while deleting Hospital", null, true);
        // }
    } catch (e) {
        return res.sendStatus(400)
    }
}

const searchHospital = async (req: Request, res: Response, next: NextFunction) => {
    const { searchedText } = req.params

    // Regex 
    const searchedTextRegex = new RegExp(searchedText, 'i')

    const searchQuery = [
        { name: searchedTextRegex },
        { address: searchedTextRegex },
        { email: searchedTextRegex },
        { tradeLicenseNo: searchedTextRegex }
    ]

    try {

        const searchedHospitalList = await Hospital.find({ $and: [{ $or: searchQuery }, { status: UserStatus.APPROVED }] })

        if (searchedHospitalList.length === 0) {
            const specialitySearchQuery = [
                { name: searchedTextRegex },
                { tags: searchedTextRegex },
            ]
            const searchSpecIds = await Speciality.find({ $or: specialitySearchQuery }).select('_id')
            // @ts-ignore
            const filteredIds = searchSpecIds.map(function (obj) { return obj._id })

            const searchedDoctorsIds = await Doctor.find({ specialityId: { $in: filteredIds } }).select('hospitalId')

            const filteredHospitalIds = searchedDoctorsIds.map(function (obj) { return obj.hospitalId })

            const searchResults = await Hospital.find({ _id: { $in: filteredHospitalIds } })

            return makeResponse(res, 200, "Search Results", searchResults, false)
        } else {
            return makeResponse(res, 200, "Search Results", searchedHospitalList, false)
        }

    } catch (err) {
        return makeResponse(res, 400, "Error while searching hospital", null, true)
    }
}

const uploadHospitalImages = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    cloudinary.v2.config({
        cloud_name: config.cloudinary.name,
        api_key: config.cloudinary.apiKey,
        api_secret: config.cloudinary.secretKey
    })

    // @ts-ignore
    const result = await cloudinary.uploader.upload(req.file.path)

    const { id } = req.params

    const filter = { _id: id }

    // @ts-ignore
    let update = { $push: { images: [result.url] } }

    Hospital.update(filter, update).then((updatedHospital: any) => {
        return makeResponse(res, 200, "Hospital image uploaded Successfully", updatedHospital, false)
    }).catch((err: any) => {
        return makeResponse(res, 400, err.message, null, true)
    })
}

const filterHospital = async (req: Request, res: Response, next: NextFunction) => {
    const { checkedCategories, hospitalTypes, checkedAddons } = req.body

    const filterQuery = {
        $and: [
            checkedCategories.length > 0 ? { 'category': { $in: checkedCategories } } : {},
            hospitalTypes.length > 0 ? { 'type': { $in: hospitalTypes } } : {},
            checkedAddons.length > 0 ? { 'services': { $in: checkedAddons } } : {},
            { status: UserStatus.APPROVED }
        ]
    }

    Hospital.find(filterQuery).then(result => {
        return makeResponse(res, 200, "Filtered Hospital", result, false)
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true)
    })
}

const getHospitalDoctors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doctors = await Doctor.find({ hospitalId: req.params.hospitalId }).populate("specialityId").populate("hospitalId")

        return makeResponse(res, 200, "Filtered Hospital", doctors, false)

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const getHospitalFinanceData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hospital = await Hospital.find({ _id: req.params.hospitalId });
        const appointments = await Slot.find({ hospitalId: req.params.hospitalId });

        return makeResponse(res, 200, "Hospital Finance Data", { hospital, appointments }, false)

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const getHospitalFinanceReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fromDate, toDate, hospitalId } = req.body;

        const hospital = await Hospital.find({ _id: hospitalId });
        const appointments = await Slot.find({
            // @ts-ignore
            hospitalId,
            from: {
                $gte: new Date(new Date(fromDate).setHours(0o0, 0o0, 0o0)),
                $lt: new Date(new Date(toDate).setHours(23, 59, 59))
            },
            status: SlotStatus.BOOKED
        }).populate("patientId");

        pdf.create(generateHospitalFinanceReport(hospital[0], appointments, fromDate, toDate), {}).toFile('Hospital Finance Report.pdf', (err) => {
            if (err) {
                return Promise.reject()
            }

            return Promise.resolve().then(result => {
                res.sendFile(path.resolve('Hospital Finance Report.pdf'))
            })
        })

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}


const getPendingHospitals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({ status: UserStatus.PENDING });
        return makeResponse(res, 200, "Pending hospitals", users, false)
    } catch (err) {
        return sendErrorResponse(res, 400, "Error while getting pending hospitals", SERVER_ERROR_CODE)
    }
}

const approveHospital = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const filter = { _id: id };
        const update = { status: UserStatus.APPROVED };
        const user = await User.findOneAndUpdate(filter, update);

        await Hospital.findOneAndUpdate({ _id: user?.referenceId }, { status: UserStatus.APPROVED });

        const options = {
            from: config.mailer.user,
            to: user?.email,
            subject: "Account Approved",
            text: `Your account has been approved, now you can login to Medicapp System`
        }

        await sendEmail(options)

        return makeResponse(res, 200, "Hospital Approved Successfully", null, false)
    } catch (err) {
        return sendErrorResponse(res, 400, "Error while approving pending hospital", SERVER_ERROR_CODE)
    }
}

const getTradeLicenseFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await Hospital.findById({ _id: id }).select(['tradeLicenseFile']);
        return makeResponse(res, 200, "TradeLicenseFile", result, false)
    } catch (err) {
        return sendErrorResponse(res, 400, "Error while getting tradeLisenceFile", SERVER_ERROR_CODE)
    }
}

const getHospitalFinanceStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fromDate, toDate, hospitalId } = req.body;

        const appointments = await Slot.find({
            // @ts-ignore
            hospitalId,
            from: {
                $gte: new Date(new Date(fromDate).setHours(0o0, 0o0, 0o0)),
                $lt: new Date(new Date(toDate).setHours(23, 59, 59))
            },
            status: SlotStatus.BOOKED
        }).populate("patientId");

        return makeResponse(res, 200, "Hospital Finance Statistics", appointments, false)

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const getMedicappPCRFinanceReport = async (req: Request, res: Response, next: NextFunction) => {
    // type: SlotTypes.MEDICAPP_PCR
    try {
        const { fromDate, toDate } = req.body;

        const appointments = await Slot.find({
            // @ts-ignore
            from: {
                $gte: new Date(new Date(fromDate).setHours(0o0, 0o0, 0o0)),
                $lt: new Date(new Date(toDate).setHours(23, 59, 59))
            },
            status: SlotStatus.BOOKED,
            type: SlotTypes.MEDICAPP_PCR
        }).populate("patientId");

        pdf.create(generateHospitalFinanceReport(null, appointments, fromDate, toDate), {}).toFile('Medicapp PCR Finance Report.pdf', (err) => {
            if (err) {
                return Promise.reject()
            }

            return Promise.resolve().then(result => {
                res.sendFile(path.resolve('Medicapp PCR Finance Report.pdf'))
            })
        })

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const getMedicappPCRFinanceStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fromDate, toDate } = req.body;

        const appointments = await Slot.find({
            // @ts-ignore
            from: {
                $gte: new Date(new Date(fromDate).setHours(0o0, 0o0, 0o0)),
                $lt: new Date(new Date(toDate).setHours(23, 59, 59))
            },
            status: SlotStatus.BOOKED,
            type: SlotTypes.MEDICAPP_PCR
        }).populate("patientId");

        return makeResponse(res, 200, "Medicapp PCR Finance Statistics", appointments, false)

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

export default {
    createHospital,
    getAllHospitals,
    getSingleHospital,
    updateHospital,
    deleteHospital,
    searchHospital,
    uploadHospitalImages,
    filterHospital,
    getHospitalDetail,
    getHospitalDoctors,
    getHospitalFinanceData,
    getHospitalFinanceReport,
    getPendingHospitals,
    approveHospital,
    getTradeLicenseFile,
    getHospitalFinanceStatistics,
    getMedicappPCRFinanceReport,
    getMedicappPCRFinanceStatistics,
}
