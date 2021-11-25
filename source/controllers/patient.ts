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
import { createAppointmentByNurse } from './appointments';
import Hospital from '../models/hospital/hospital';
import { Pagination } from '../constants/pagination';
import { validatePatientRegisteration } from '../validation/patientRegisteration';
import { DUPLICATE_VALUE_CODE, PARAMETER_MISSING_CODE, SERVER_ERROR_CODE, UNAUTHORIZED_CODE } from '../constants/statusCode';
import LaboratoryRequest from '../models/labortories/labRequest';
import QrPrescription from '../models/labortories/QrPrescription';

const NAMESPACE = "Patient";

const createPatient = async (req: Request, res: Response, next: NextFunction) => {
    // uploadEmirateFileId(req, res, async (error: any) => {
    //     if (error) {
    //       return sendErrorResponse(res, 400, "Error in uploading Patient Emirate ID File", SERVER_ERROR_CODE);
    //     } else {
    //       // If File not found
    //       // console.log("Ressss => ", req.files);
    //       if (req.file === undefined) {
    //         return sendErrorResponse(res, 400, "No File Selected", PARAMETER_MISSING_CODE);
    //       } else {
  
            const { firstName, lastName, email, birthday, emiratesId, gender, location, phone, password } = req.body;
    
            const { errors, isValid } = validatePatientRegisteration(req.body);
            // Check validation
            if (!isValid) {
                // @ts-ignore
                return sendErrorResponse(res, 400, Object.values(errors)[0], Object.values(errors)[0].includes("invalid") ? INVALID_VALUE_CODE : PARAMETER_MISSING_CODE);
            }

            await User.find({ email }).then((result: any) => {
                if(result.length === 0){
                    // @ts-ignore
                    const newPatient = new Patient({
                            _id: new mongoose.Types.ObjectId(),
                            firstName, lastName, email, birthday, gender, location, phone, emiratesId
                            // @ts-ignore
                            // emiratesIdFile: req.file.location
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
                                UserController.createPatientUserFromEmailAndPassword(req, res, email, password, firstName, lastName, phone, emiratesId, Roles.PATIENT, result._id);
                            })
                            .catch(err => {
                                return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
                            });
                }else {
                    return sendErrorResponse(res, 400, "Email already exists", DUPLICATE_VALUE_CODE);
                }
            }); 
};

const createPatientFromNurse = async (req: Request, res: Response, next: NextFunction) => {
        const { email, firstName, lastName, mobile, time, doctorId, referenceId, birthday, gender, location } = req.body;
        const password = getRandomPassword();
        
        const nurse: any = await Nurse.find({_id: referenceId});

        await User.find({email}).then(result => {
            if(result.length === 0){
                if(email && firstName && lastName && mobile){
                    const newPatient = new Patient({
                        _id: new mongoose.Types.ObjectId(),
                        birthday, gender, location, email, password, firstName, lastName, mobile, hospitalId: nurse[0].hospitalId
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
                            // TODO: Frontend se Nurse dashboard se jb patient create hota hai tb b patient ki emiratesId store krani hai lazmi werna issue ayega
                            UserController.createUserFromEmailAndPassword(req, res, email, password, firstName, lastName, "" ,Roles.PATIENT, result._id);
                            createAppointmentByNurse(req, res, next, time, doctorId, result._id, nurse[0].hospitalId);
                            return makeResponse(res, 201, "Patient Created Successfully", result, false);
                        })
                        .catch(err => {
                            return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
                        });
                }else {
                    return sendErrorResponse(res, 400, "Validation Failed", SERVER_ERROR_CODE);
                }
            }else {
                return makeResponse(res, 400, "Email Already in use", null, true);
            }
        })
}

const getAllPatients = async (req: Request, res: Response, next: NextFunction) => {
    const { role, reference_id, _id } = res.locals.jwt;
    
    // @ts-ignore
    const page = parseInt(req.query.page || "0");

    let hospitalId = null;

    if(role === Roles.NURSE){
        const nurse: any  = await Nurse.findById(reference_id);
        hospitalId = nurse.hospitalId;
    }else if(role === Roles.HOSPITAL){
        const hospital: any  = await Hospital.findById(reference_id);
        hospitalId = hospital._id;
    }

    if(role === Roles.DOCTOR){
        const total = await Appointment.find({ doctorId: reference_id }).countDocuments({});

        Appointment.find({ doctorId: reference_id }).limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page).populate('patientId')
            .then(result => {
                const patients = result.map(item => ( item.patientId ))
    
                return makeResponse(res, 200, "All Patients", {totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), patients }, false);
            })
            .catch(err => {
                return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
            })
    }else {
        const total = await Appointment.find({ hospitalId }).countDocuments({});

        Appointment.find({ hospitalId }).limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page).populate('patientId')
            .then(result => {
                const patients = result.map(item => ( item.patientId ))

                return makeResponse(res, 200, "All Patients", {totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), patients }, false);
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

            doctors = result.map(item => ( item.doctorId ));
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
    const { id } = req.params;

    const filter = { _id: id };
    let update = {...req.body};

    Patient.findOneAndUpdate(filter, update).then(updatedPatient => {
        return makeResponse(res, 200, "Patient updated Successfully", updatedPatient, false);
    }).catch(err => {
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
    });
};

const deletePatient = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    try {
        const patient = await Patient.findByIdAndDelete(_id);
    if (!patient) return sendErrorResponse(res, 400, "Patient not found with this ID", SERVER_ERROR_CODE);
        await UserController.deleteUserWithEmail(patient.email)
        await Appointment.deleteMany({ patientId: patient._id});
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

        // Get Upcomming Appointments
        const upcommingAppointments = await Appointment.find({patientId: req.params.id}).select(['-hospitalId'])
            .populate("patientId")
            .populate({
                path : 'doctorId',
                populate: [
                  { path: 'specialityId' },
                  { path: 'hospitalId' }
                ]
              })

        // Get Lab Results
        const labResults = await LaboratoryRequest.find({ patientId: req.params.id });

        // Get QR Prescriptions
        const qrPrescriptions = await QrPrescription.find({ patientId: req.params.id }).populate("doctorId");
        
        return makeResponse(res, 200, "Patient profile data", {
            patient,
            upcommingAppointments,
            labResults,
            qrPrescriptions
        }, false);

        
    } catch(err: any) {
        console.log("OUT PATIENT");
        
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
    }
};

export default { 
    createPatient, 
    getAllPatients,
    getSinglePatient,
    updatePatient,
    deletePatient,
    createPatientFromNurse,
    getPatientAccountInfo
};
