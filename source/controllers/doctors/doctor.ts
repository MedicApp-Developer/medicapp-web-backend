import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import Doctor from '../../models/doctors/doctor'
import User from '../../models/user'
import makeResponse, { sendErrorResponse } from '../../functions/makeResponse'
import UserController from '../user'
import { Roles, UserStatus } from '../../constants/roles'
import { sendEmail } from '../../functions/mailer'
import { sendSupportEmail } from '../../functions/supportMailer'
import { getRandomPassword } from '../../functions/utilities'
import config from '../../config/config'
import { Pagination } from '../../constants/pagination'
import Nurse from '../../models/nurse/nurse'
import Hospital from '../../models/hospital/hospital'
import { uploadImage } from '../../functions/uploadS3'
import { PARAMETER_MISSING_CODE, SERVER_ERROR_CODE } from '../../constants/statusCode'
import Speciality from '../../models/doctors/speciality'
import cloudinary from 'cloudinary'

const NAMESPACE = "Doctor"

const createDoctor = async (req: Request, res: Response, next: NextFunction) => {
    const { email, firstName, lastName, mobile, specialityId, experience, gender, country, language } = req.body
    

    const password = getRandomPassword()

    if (email && firstName && lastName && mobile && specialityId && experience && gender && country && language) {
        await User.find({ email }).then(result => {
            if (result.length === 0) {

                if (email && firstName && lastName && mobile) {
                    const newDoctor = new Doctor({
                        _id: new mongoose.Types.ObjectId(),
                        experience, specialityId,
                        language, country, gender,
                        email, password, firstName, lastName, mobile, hospitalId: res.locals.jwt.reference_id
                    })

                    const options = {
                        from: config.mailer.user,
                        to: email,
                        subject: "Welcome to Medicapp",
                        text: `Your account account has been created as a doctor, and your password is ${password}`
                    }

                    sendSupportEmail(options, false)

                    return newDoctor.save()
                        .then(async result => {
                            await UserController.createUserFromEmailAndPassword(req, res, email, password, firstName, lastName, "", Roles.DOCTOR, result._id)
                            return makeResponse(res, 201, "Doctor Created Successfully", result, false)
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

const uploadProfilePic = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    cloudinary.v2.config({
        cloud_name: config.cloudinary.name,
        api_key: config.cloudinary.apiKey,
        api_secret: config.cloudinary.secretKey
    })

    // @ts-ignore
    const result = await cloudinary.uploader.upload(req.file.path)

    // This id is updated hospital itself id 
    const { id } = req.params

    const filter = { _id: id }

    // @ts-ignore
    Doctor.findOneAndUpdate(filter, { image: result.url }, { new: true }).then(updatedDoctor => {
        return makeResponse(res, 200, "Doctor profile picture uploaded Successfully", updatedDoctor, false)
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true)
    })
}

const getAllDoctors = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const page = parseInt(req.query.page || "0")
    let hospitalId = null
    // TODO: Multiple timings in a single day for a doctor
    if (req.query.getAll !== "undefined") {
        Doctor.find({})
            .populate("specialityId")
            .populate("hospitalId")
            .populate("country")
            .populate("gender")
            .populate("language")
            .then(doctors => {
                return makeResponse(res, 200, "All Doctors", { doctors }, false)
            }).catch(err => {
                return makeResponse(res, 400, err.message, null, true)
            })
    } else if (res.locals.jwt.role === Roles.HOSPITAL) {
        hospitalId = res.locals.jwt.reference_id
        const total = await Doctor.find({ hospitalId }).countDocuments({})

        Doctor.find({ hospitalId })
            .populate("specialityId")
            .populate("hospitalId")
            .populate("country")
            .populate("gender")
            .populate("language")
            .limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page)
            .then(result => {
                return makeResponse(res, 200, "All Doctors", { totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), doctors: result }, false)
            })
            .catch(err => {
                return makeResponse(res, 400, err.message, null, true)
            })
    } else if (res.locals.jwt.role === Roles.NURSE) {
        const { reference_id } = req.query
        const nurse = await Nurse.findById(reference_id)
        hospitalId = nurse?.hospitalId
        Doctor.find({ hospitalId })
            .populate("specialityId")
            .populate("hospitalId")
            .populate("country")
            .populate("gender")
            .populate("language")
            .then(result => {
                return makeResponse(res, 200, "All Doctors", { doctors: result }, false)
            })
            .catch(err => {
                return makeResponse(res, 400, err.message, null, true)
            })

    }

}

const getAllPatientDoctors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        Doctor.find({})
            .populate("specialityId")
            .populate("hospitalId")
            .populate("country")
            .populate("gender")
            .populate("language")
            .then(doctors => {
                return makeResponse(res, 200, "All Doctors", { doctors }, false)
            }).catch(err => {
                return makeResponse(res, 400, err.message, null, true)
            })
    } catch (err) {
        // @ts-ignore
        return makeResponse(res, 400, err.message, null, true)
    }
}

const getSingleDoctor = (req: Request, res: Response, next: NextFunction) => {
    Doctor.findById({ _id: req.params.id })
        .populate('hospitalId')
        .populate("specialityId")
        .populate("country")
        .populate("gender")
        .populate("language")
        .then(data => {
            return makeResponse(res, 200, "Doctor", data, false)
        }).catch(err => {
            return makeResponse(res, 400, err.message, null, true)
        })
}

const updateDoctor = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = res.locals.jwt

    // This id is updated doctor itself id 
    const { id } = req.params

    const update = JSON.parse(JSON.stringify({ ...req.body }))

    update.password && delete update.password

    const filter = { _id: id }

    const updatedUser = await UserController.updateUser(req, res, _id, req.body)
    

    if (updatedUser !== null) {
        Doctor.findOneAndUpdate(filter, update, { new: true }).populate('specialityId').then(updatedDoctor => {
            return makeResponse(res, 200, "Doctor updated Successfully", { doctor: updatedDoctor, user: updatedUser }, false)
        }).catch(err => {
            return makeResponse(res, 400, err.message, null, true)
        })
    } else {
        return makeResponse(res, 400, 'Failed to update user', null, true)
    }
}

const deleteDoctor = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    try {
        const doctor = await Doctor.findByIdAndDelete(_id)
        if (!doctor) return res.sendStatus(404)
        await UserController.deleteUserWithEmail(doctor.email)
        return makeResponse(res, 200, "Deleted Successfully", doctor, false)
    } catch (e) {
        return res.sendStatus(400)
    }
}

const searchDoctor = async (req: Request, res: Response, next: NextFunction) => {
    const { searchedText } = req.params
    // @ts-ignore
    const page = parseInt(req.query.page || "0")

    // Regex 
    const searchedTextRegex = new RegExp(searchedText, 'i')

    const searchQuery = [
        { firstName: searchedTextRegex },
        { lastName: searchedTextRegex },
        { email: searchedTextRegex },
        { mobile: searchedTextRegex },
        { experience: searchedTextRegex },
        { language: searchedTextRegex },
        { country: searchedTextRegex },
        { gender: searchedTextRegex }
    ]

    const total = await Doctor.find({ $and: [{ $or: searchQuery }, { hospitalId: res.locals.jwt.reference_id }] }).countDocuments({})

    Doctor.find({ $and: [{ $or: searchQuery }, { hospitalId: res.locals.jwt.reference_id }] }).limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page)
        .then(result => {
            return makeResponse(res, 200, "Search Results", { searchedText, totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), doctors: result }, false)
        }).catch(err => {
            return makeResponse(res, 400, "No doctor found", null, true)
        })
}

const searchDoctorsOfAllHospitals = async (req: Request, res: Response, next: NextFunction) => {
    const { searchedText } = req.params
    // Regex 
    const searchedTextRegex = new RegExp(searchedText, 'i')

    const searchQuery = [
        { firstName: searchedTextRegex },
        { lastName: searchedTextRegex },
        { email: searchedTextRegex },
        { mobile: searchedTextRegex },
        { experience: searchedTextRegex },
        { language: searchedTextRegex },
        { country: searchedTextRegex },
        { gender: searchedTextRegex }
    ]

    try {
        const searchedDoctorsList = await Doctor.find({ $or: searchQuery })

        if (searchedDoctorsList.length === 0) {
            const specialitySearchQuery = [
                { name: searchedTextRegex },
                { tags: searchedTextRegex },
            ]
            const searchSpecIds = await Speciality.find({ $or: specialitySearchQuery }).select('_id')
            // @ts-ignore
            const filteredIds = searchSpecIds.map(function (obj) { return obj._id })

            const searchedDoctors = await Doctor.find({ specialityId: { $in: filteredIds } }).populate('specialityId').populate("country")
                .populate("gender")
                .populate("language")

            return makeResponse(res, 200, "Search Results", searchedDoctors, false)

        } else {
            return makeResponse(res, 200, "Search Results", searchedDoctorsList, false)
        }

    } catch (err) {
        return makeResponse(res, 400, "No doctor found", null, true)
    }
}

const searchHospitalAndDoctor = async (req: Request, res: Response, next: NextFunction) => {

    const { text, searchFor, checkedGenders, checkedLanguages, checkedNationalities, checkedSpecialities, checkedCategories, hospitalTypes, checkedAddons } = req.body

    // Regex 
    const searchedTextRegex = new RegExp(text, 'i')

    const hospitalSearchQuery = [
        { name: searchedTextRegex },
        { address: searchedTextRegex },
        { email: searchedTextRegex },
        { tradeLicenseNo: searchedTextRegex }
    ]

    const doctorSearchQuery = [
        { firstName: searchedTextRegex },
        { lastName: searchedTextRegex },
        { email: searchedTextRegex },
        { mobile: searchedTextRegex }
    ]

    let searchedHospitals = null
    let searchedDoctors = null

    if (searchFor === Roles.HOSPITAL) {
        const filterQuery = {
            $and: [
                text !== "" ? { $or: hospitalSearchQuery } : {},
                checkedCategories?.length > 0 ? { 'category': { $in: checkedCategories } } : {},
                hospitalTypes?.length > 0 ? { 'type': { $in: hospitalTypes } } : {},
                checkedAddons?.length > 0 ? { 'services': { $in: checkedAddons } } : {},
                { status: UserStatus.APPROVED }
            ]
        }
        searchedHospitals = await Hospital.find(filterQuery).populate("category").populate('insurances')
    } else if (searchFor === Roles.DOCTOR) {

        const filterQuery = {
            $and: [
                text !== "" ? { $or: doctorSearchQuery } : {},
                checkedSpecialities?.length > 0 ? { 'specialityId': { $in: checkedSpecialities } } : {},
                checkedLanguages?.length > 0 ? { 'language': { $in: checkedLanguages } } : {},
                checkedNationalities?.length > 0 ? { 'country': { $in: checkedNationalities } } : {},
                checkedGenders?.length > 0 ? { 'gender': { $in: checkedGenders } } : {}
            ]
        }

        searchedDoctors = await Doctor.find(filterQuery)
            .populate("specialityId")
            .populate({ path: 'hospitalId', populate: [{ path: 'insurances' }] })
            .populate("country")
            .populate("gender")
            .populate("language")

        if (searchedDoctors.length === 0 && text) {
            const specialitySearchQuery = [
                { name: searchedTextRegex },
                { tags: searchedTextRegex },
            ]
            const searchSpecIds = await Speciality.find({ $or: specialitySearchQuery }).select('_id')
            // @ts-ignore
            const filteredIds = searchSpecIds.map(function (obj) { return obj._id })

            searchedDoctors = await Doctor.find({ specialityId: { $in: filteredIds } })
                .populate('specialityId')
                .populate({ path: 'hospitalId', populate: [{ path: 'insurances' }] })
                .populate("country")
                .populate("gender")
                .populate("language")
        }
    } else {

        searchedHospitals = await Hospital.find({ $and: [{ $or: hospitalSearchQuery }, { status: UserStatus.APPROVED }] }).populate("category").populate('insurances')
        // @ts-ignore
        searchedDoctors = await Doctor.find({ $or: doctorSearchQuery }).populate('specialityId', null, { name: "One" })
            .populate({ path: 'hospitalId', populate: [{ path: 'insurances' }] })
            .populate("country")
            .populate("gender")
            .populate("language")

        if (searchedDoctors.length === 0) {
            const specialitySearchQuery = [
                { name: searchedTextRegex },
                { tags: searchedTextRegex },
            ]
            const searchSpecIds = await Speciality.find({ $or: specialitySearchQuery }).select('_id')
            // @ts-ignore
            const filteredIds = searchSpecIds.map(function (obj) { return obj._id })

            searchedDoctors = await Doctor.find({ specialityId: { $in: filteredIds } })
                .populate('specialityId')
                .populate({ path: 'hospitalId', populate: [{ path: 'insurances' }] })
                .populate("country")
                .populate("gender")
                .populate("language")
        }
    }

    return makeResponse(res, 200, "Search Results", { hospital: searchedHospitals ?? [], doctor: searchedDoctors ?? [] }, false)
}

const searchDoctorBySpeciality = async (req: Request, res: Response, next: NextFunction) => {
    Doctor.find({ specialityId: req.params.specialityId })
        .populate("specialityId")
        .populate({ path: 'hospitalId', populate: [{ path: 'insurances' }] })
        .populate("country")
        .populate("gender")
        .populate("language")
        .then(data => {
            return makeResponse(res, 200, "Searched Doctor", data, false)
        }).catch(err => {
            return makeResponse(res, 400, err.message, null, true)
        })
}

const filterDoctors = async (req: Request, res: Response, next: NextFunction) => {
    const { checkedSpecialities, hospitalTypes, checkedLanguages, checkedNationalities, checkedGenders } = req.body

    // TODO: Search By Hospital Types

    const filterQuery = {
        $and: [
            checkedSpecialities.length > 0 ? { 'specialityId': { $in: checkedSpecialities } } : {},
            checkedLanguages.length > 0 ? { 'language': { $in: checkedLanguages } } : {},
            checkedNationalities.length > 0 ? { 'country': { $in: checkedNationalities } } : {},
            checkedGenders.length > 0 ? { 'gender': { $in: checkedGenders } } : {}
        ]
    }

    Doctor.find(filterQuery).populate({ path: 'hospitalId', populate: [{ path: 'insurances' }] }).then(result => {
        return makeResponse(res, 200, "Filtered Doctors", result, false)
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true)
    })
}

const deleteProfileImage = async (req: Request, res: Response, next: NextFunction) => {
    const { doctorId } = req.params;
    

    Doctor.findOneAndUpdate({ _id: doctorId }, { image: '' }, { new: true })
        .then(updatedDoctor => {
            return makeResponse(res, 200, "Doctor profile picture removed", updatedDoctor, false)
        })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true)
        })
}

export default {
    createDoctor,
    getAllDoctors,
    getAllPatientDoctors,
    getSingleDoctor,
    updateDoctor,
    deleteDoctor,
    searchDoctor,
    searchHospitalAndDoctor,
    searchDoctorBySpeciality,
    uploadProfilePic,
    filterDoctors,
    searchDoctorsOfAllHospitals,
    deleteProfileImage
}
