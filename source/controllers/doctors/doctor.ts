import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Doctor from '../../models/doctors/doctor';
import User from '../../models/user';
import makeResponse from '../../functions/makeResponse';
import UserController from '../user';
import { Roles } from '../../constants/roles';
import { sendEmail } from '../../functions/mailer';
import { getRandomPassword } from '../../functions/utilities';
import config from '../../config/config';
import { Pagination } from '../../constants/pagination';
import Nurse from '../../models/nurse/nurse';
import Hospital from '../../models/hospital/hospital';

const NAMESPACE = "Doctor";

const createDoctor = async (req: Request, res: Response, next: NextFunction) => {
        const { email, firstName, lastName, mobile, specialityId, experience } = req.body;
        const password = getRandomPassword();

        await User.find({email}).then(result => {
            if(result.length === 0){
                
                if(email && firstName && lastName && mobile){
                    const newDoctor = new Doctor({
                        _id: new mongoose.Types.ObjectId(),
                        experience, specialityId,
                        email, password, firstName, lastName, mobile, hospitalId: res.locals.jwt.reference_id
                    }); 

                    const options = {
                        from: config.mailer.user,
                        to: email,
                        subject: "Welcome to Medicapp",
                        text: `Your account account has been created as a doctor, and your password is ${password}`
                    }

                    sendEmail(options);
                    
                    return newDoctor.save()
                        .then(async result => {
                            await UserController.createUserFromEmailAndPassword(req, res, email, password, firstName, lastName, "",Roles.DOCTOR, result._id)
                            return makeResponse(res, 201, "Doctor Created Successfully", result, false);
                        })
                        .catch(err => {
                            return makeResponse(res, 400, err.message, null, true);
                        });
                }else {
                    return makeResponse(res, 400, "Validation Failed", null, true);
                }
            }else {
                return makeResponse(res, 400, "Email Already in use", null, true);
            }
        })
};

const getAllDoctors = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const page = parseInt(req.query.page || "0");
    let hospitalId = null;
    // TODO: Multiple timings in a single day for a doctor
    if(res.locals.jwt.role === Roles.HOSPITAL){
        hospitalId = res.locals.jwt.reference_id;
        const total = await Doctor.find({ hospitalId }).countDocuments({});

        Doctor.find({ hospitalId }).populate("specialityId").limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page)
            .then(result => {
                return makeResponse(res, 200, "All Doctors", {totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), doctors: result}, false);
            })
            .catch(err => {
                return makeResponse(res, 400, err.message, null, true);
            })
    }else if(res.locals.jwt.role === Roles.NURSE) {
        const { reference_id } = req.query;
        const nurse = await Nurse.findById(reference_id);
        hospitalId = nurse?.hospitalId;
        Doctor.find({ hospitalId }).populate("specialityId")
            .then(result => {
                return makeResponse(res, 200, "All Doctors", { doctors: result }, false);
            })
            .catch(err => {
                return makeResponse(res, 400, err.message, null, true);
            })
    }

};

const getSingleDoctor = (req: Request, res: Response, next: NextFunction) => {
    Doctor.findById({ _id: req.params.id }).populate('hospitalId').populate("specialityId")
    .then(data => {
        return makeResponse(res, 200, "Doctor", data, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    })
};

const updateDoctor = (req: Request, res: Response, next: NextFunction) => {
    const { _id } = res.locals.jwt;

    // This id is updated hospital itself id 
    const { id } = req.params;

    const update = JSON.parse(JSON.stringify({...req.body}));

    update.password && delete update.password;

    const filter = { _id: id };

    UserController.updateUser(req, res, _id, req.body);
    
    Doctor.findOneAndUpdate(filter, update).then(updatedDoctor => {
        return makeResponse(res, 200, "Doctor updated Successfully", updatedDoctor, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

const deleteDoctor = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    try {
        const doctor = await Doctor.findByIdAndDelete(_id);
    if (!doctor) return res.sendStatus(404);
        await UserController.deleteUserWithEmail(doctor.email);
        return makeResponse(res, 200, "Deleted Successfully", doctor, false);
    } catch (e) {
        return res.sendStatus(400);
    }
};

const searchDoctor = async (req: Request, res: Response, next: NextFunction) => {
    const { searchedText } = req.params;
    // @ts-ignore
    const page = parseInt(req.query.page || "0");

    // Regex 
    const searchedTextRegex = new RegExp(searchedText, 'i');

    const searchQuery = [
        { firstName: searchedTextRegex }, 
        { lastName: searchedTextRegex },
        { email: searchedTextRegex },
        { mobile: searchedTextRegex } 
    ]

    const total = await Doctor.find({$and: [{$or: searchQuery}, {hospitalId :  res.locals.jwt.reference_id }]}).countDocuments({});

    Doctor.find({$and: [{$or: searchQuery}, {hospitalId:  res.locals.jwt.reference_id }]}).limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page)
    .then(result => {
        return makeResponse(res, 200, "Search Results", {searchedText, totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), doctors: result}, false);
    }).catch(err => {
        return makeResponse(res, 400, "No doctor found", null, true);
    });
};

const searchHospitalAndDoctor = async (req: Request, res: Response, next: NextFunction) => {
    const { searchedText } = req.params;
    // Regex 
    const searchedTextRegex = new RegExp(searchedText, 'i');

    const hospitalSearchQuery = [
        { name: searchedTextRegex }, 
        { location: searchedTextRegex },
        { email: searchedTextRegex },
        { tradeLicenseNo: searchedTextRegex } 
    ]

    const doctorSearchQuery = [
        { firstName: searchedTextRegex }, 
        { lastName: searchedTextRegex },
        { email: searchedTextRegex },
        { mobile: searchedTextRegex } 
    ]

    const searchedHospitals = await Hospital.find({$or: hospitalSearchQuery});
    const searchedDoctors = await Doctor.find({$or: doctorSearchQuery});

    return makeResponse(res, 200, "Search Results", { hospital: searchedHospitals, doctor: searchedDoctors }, false);
};

const searchDoctorBySpeciality = async (req: Request, res: Response, next: NextFunction) => {
    Doctor.find({ specialityId: req.params.specialityId }).populate("specialityId")
    .then(data => {
        return makeResponse(res, 200, "Searched Doctor", data, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    })
};

export default { 
    createDoctor, 
    getAllDoctors,
    getSingleDoctor,
    updateDoctor,
    deleteDoctor,
    searchDoctor,
    searchHospitalAndDoctor,
    searchDoctorBySpeciality
};
