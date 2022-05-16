import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Patient from '../models/patient';
import makeResponse, { sendErrorResponse } from '../functions/makeResponse';
import UserController from '../controllers/user';
import { Roles } from '../constants/roles';
import config from '../config/config';
import Appointment from '../models/appointment';
import Nurse from '../models/nurse/nurse';
import User from '../models/user';
import { getRandomPassword } from '../functions/utilities';
import { sendEmail } from '../functions/mailer';
import { Pagination } from '../constants/pagination';
import { validatePatientRegisteration } from '../validation/patientRegisteration';
import { DUPLICATE_VALUE_CODE, PARAMETER_MISSING_CODE, SERVER_ERROR_CODE, UNAUTHORIZED_CODE } from '../constants/statusCode';
import LaboratoryRequest from '../models/labortories/labRequest';
import QrPrescription from '../models/labortories/QrPrescription';
import bcryptjs from 'bcryptjs';
import signJWT from '../functions/signJWT';
import Slot from '../models/doctors/slot';
import { SlotStatus } from '../constants/slot';
import Family from '../models/family';
import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';

const NAMESPACE = "Patient";

const createPatient = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, birthday, emiratesId, gender, location, phone, password } = req.body;

    const { errors, isValid } = validatePatientRegisteration(req.body);
    // Check validation
    if (!isValid) {
        // @ts-ignore
        return sendErrorResponse(res, 400, Object.values(errors)[0], Object.values(errors)[0].includes("invalid") ? INVALID_VALUE_CODE : PARAMETER_MISSING_CODE);
    }

    try {
        const result = await User.find({ $or: [{ email }, { emiratesId }] });

        if (result.length === 0) {
            const newPatient = new Patient({
                _id: new mongoose.Types.ObjectId(),
                firstName, lastName, email, birthday, gender, location, phone, emiratesId
            });

            const savedPatient = await newPatient.save();

            if (savedPatient) {
                bcryptjs.hash(password, 10, async (hashError, hash) => {
                    if (hashError) {
                        return false;
                    }

                    // @ts-ignore
                    const _user = new User({ _id: new mongoose.Types.ObjectId(), firstName, lastName, email, phoneNo: phone, password: hash, role: Roles.PATIENT, emiratesId, referenceId: savedPatient._id });
                    _user.save().then(createdUser => {
                        // @ts-ignore
                        signJWT(createdUser, (_error, token) => {
                            if (_error) {
                                return sendErrorResponse(res, 400, "Unauthorized", UNAUTHORIZED_CODE);
                            } else if (token) {
                                console.log(path.join((`${__dirname}`)));
                                const content = fs.readFileSync(path.join((`${__dirname}/../templates/RegisterationEmail.html`)));

                                let final_template = content.toString().replace('[name]', firstName + " " + lastName).toString().replace('[username]', email).toString().replace('[password]', password);


                                const options = {
                                    from: config.mailer.user,
                                    to: email,
                                    subject: "Welcome to Medicapp",
                                    html: final_template
                                }

                                sendEmail(options);
                                return makeResponse(res, 200, "Patient registered successfully", { bookmarks: { doctorIds: [], hospitalIds: [] }, user: savedPatient, familyMembers: [], token: token }, false);
                            }
                        })
                    });

                }
                )
            }
        } else {
            return sendErrorResponse(res, 400, "Email OR Emirates ID already exists", DUPLICATE_VALUE_CODE);
        }

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
    }
};

const createPatientFromNurse = async (req: Request, res: Response, next: NextFunction) => {
    const { email, firstName, lastName, mobile, birthday, gender, location, emiratesId } = req.body;
    const password = getRandomPassword();

    await User.find({ email }).then(async result => {
        if (result.length === 0) {
            if (email && firstName && lastName && mobile) {
                const newPatient = new Patient({
                    _id: new mongoose.Types.ObjectId(),
                    birthday, gender, location, email, password, firstName, lastName, phone: mobile, emiratesId
                });

                const options = {
                    from: config.mailer.user,
                    to: email,
                    subject: "Welcome to Medicapp",
                    text: `Your account account has been created as a patient, and your password is ${password}`
                }

                sendEmail(options);

                return newPatient.save()
                    .then(async result => {
                        await UserController.createUserFromEmailAndPassword(req, res, email, password, firstName, lastName, "", Roles.PATIENT, result._id)
                        return makeResponse(res, 201, "Patient Created Successfully", result, false);
                    })
                    .catch(err => {
                        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
                    });
            } else {
                return sendErrorResponse(res, 400, "Validation Failed", SERVER_ERROR_CODE);
            }
        }
    })
}

const getAllPatients = async (req: Request, res: Response, next: NextFunction) => {
    const { role, reference_id, _id } = res.locals.jwt;

    // @ts-ignore
    const page = parseInt(req.query.page || "0");

    let hospitalId = null;

    if (role === Roles.NURSE) {
        const nurse: any = await Nurse.findById(reference_id);
        hospitalId = nurse.hospitalId;
    } else if (role === Roles.HOSPITAL) {
        hospitalId = reference_id;
    }

    if (role === Roles.DOCTOR) {
        Slot.find({ doctorId: reference_id, status: SlotStatus.BOOKED })
            .then(async result => {
                const patients = result.map(item => (item.patientId))

                const patientIds: any = [];

                patients.map(item => {
                    // @ts-ignore
                    if (patientIds.filter(pat => pat.equals(item)).length === 0) {
                        patientIds.push(item);
                    }
                })

                const total = await Patient.find({ '_id': { $in: patientIds } }).countDocuments({});

                const patientsArray = await Patient.find({ '_id': { $in: patientIds } }).limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page)

                return makeResponse(res, 200, "All Patients", { totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), patients: patientsArray }, false);
            })
            .catch(err => {
                return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
            })
    } else {
        Slot.find({ hospitalId, status: SlotStatus.BOOKED })
            .then(async result => {
                const patients = result.map(item => (item.patientId))

                const patientIds: any = [];

                patients.map(item => {
                    // @ts-ignore
                    if (patientIds.filter(pat => pat.equals(item)).length === 0) {
                        patientIds.push(item);
                    }
                })

                const total = await Patient.find({ '_id': { $in: patientIds } }).countDocuments({});

                const patientsArray = await Patient.find({ '_id': { $in: patientIds } }).limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page)

                return makeResponse(res, 200, "All Patients", { totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), patients: patientsArray }, false);
            })
            .catch(err => {
                return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
            })
    }
};

const getSinglePatient = async (req: Request, res: Response, next: NextFunction) => {

    let doctors: any = null;

    await Appointment.find({ patientId: req.params.id }).populate('doctorId')
        .then(result => {

            doctors = result.map(item => (item.doctorId));
            Patient.findById({ _id: req.params.id })
                .then((data: any) => {
                    const newTemp = JSON.parse(JSON.stringify(data));
                    newTemp.doctors = doctors;
                    return makeResponse(res, 200, "Patient", newTemp, false);
                }).catch(err => {
                    return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
                })
        })
        .catch(err => {
            return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
        })
};

const updatePatient = (req: Request, res: Response, next: NextFunction) => {
    const { _id } = res.locals.jwt;

    const { id } = req.params;

    const update = JSON.parse(JSON.stringify({ ...req.body }));

    update.password && delete update.password;

    const filter = { _id: id };

    UserController.updateUser(req, res, _id, req.body);

    Patient.findOneAndUpdate(filter, update, { new: true }).then(updatedPatient => {
        return makeResponse(res, 200, "Doctor updated Successfully", updatedPatient, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

const deletePatient = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    try {
        const patient = await Patient.findByIdAndDelete(_id);
        if (!patient) return sendErrorResponse(res, 400, "Patient not found with this ID", SERVER_ERROR_CODE);
        await UserController.deleteUserWithEmail(patient.email)
        await Appointment.deleteMany({ patientId: patient._id });
        return makeResponse(res, 200, "Deleted Successfully", patient, false);
    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
    }
};

const getPatientAccountInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get all information of patient
        const patient = await Patient.findById({ _id: req.params.id });
        const familyMembers = await Family.find({ patientId: req.params.id });

        // Get Upcomming Appointments
        const upcommingAppointments = await Slot.find({ patientId: req.params.id })
            .populate("patientId")
            .populate("familyMemberId")
            .populate("hospitalId")
            .populate({
                path: 'doctorId',
                populate: [
                    { path: 'specialityId' },
                    { path: 'hospitalId' }
                ]
            })

        // Get Lab Results
        const labResults = await LaboratoryRequest.find({ patientId: req.params.id }).populate({
            path: 'doctorId',
            populate: [
                { path: 'specialityId' },
                { path: 'hospitalId' }
            ]
        });

        // Get QR Prescriptions
        const qrPrescriptions = await QrPrescription.find({ patientId: req.params.id })
            .populate({
                path: 'doctorId',
                populate: [
                    { path: 'specialityId' },
                    { path: 'hospitalId' }
                ]
            });

        return makeResponse(res, 200, "Patient profile data", {
            patient,
            upcommingAppointments,
            labResults,
            qrPrescriptions,
            familyMembers
        }, false);


    } catch (err: any) {
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
    }
};

const getLabResults = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get Lab Results
        const labResults = await LaboratoryRequest.find({ patientId: req.params.id }).populate({
            path: 'doctorId',
            populate: [
                { path: 'specialityId' },
                { path: 'hospitalId' }
            ]
        });

        return makeResponse(res, 200, "Patient lab results", labResults, false);


    } catch (err: any) {
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
    }
};

const getQRPrescription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get QR Prescriptions
        const qrPrescriptions = await QrPrescription.find({ patientId: req.params.id })
            .populate({
                path: 'doctorId',
                populate: [
                    { path: 'specialityId' },
                    { path: 'hospitalId' }
                ]
            });

        return makeResponse(res, 200, "Patient lab results", qrPrescriptions, false);

    } catch (err: any) {
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
    }
};

const uploadProfilePic = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    cloudinary.v2.config({
        cloud_name: config.cloudinary.name,
        api_key: config.cloudinary.apiKey,
        api_secret: config.cloudinary.secretKey
    })

    // @ts-ignore
    const result = await cloudinary.uploader.upload(req.file.path);

    // This id is updated hospital itself id 
    const { id } = req.params;

    const filter = { _id: id };

    // @ts-ignore
    Patient.findOneAndUpdate(filter, { image: result.url }, { new: true }).then(updatedPatient => {
        return makeResponse(res, 200, "Patient profile picture uploaded Successfully", updatedPatient, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
}

export default {
    createPatient,
    getAllPatients,
    getSinglePatient,
    updatePatient,
    deletePatient,
    createPatientFromNurse,
    getPatientAccountInfo,
    getLabResults,
    getQRPrescription,
    uploadProfilePic
};
