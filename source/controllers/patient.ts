import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Patient from '../models/patient';
import makeResponse from '../functions/makeResponse';
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

const NAMESPACE = "Patient";

const createPatient = (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName, birthday, gender, emiratesId, location } = req.body;
    if(email && password && firstName && lastName && birthday && gender && emiratesId && location ){
        const newPatient = new Patient({
            _id: new mongoose.Types.ObjectId(),
            email, firstName, lastName, birthday, gender, emiratesId, location,
            // emiratesIdFile: config.server.APP_URL + "/" + (( req && req.file && req.file.filename ) ? req.file.filename : "")
        }); 

        return newPatient.save()
            .then(async result => {
                await UserController.createUserFromEmailAndPassword(req, res, email, password, firstName + " " + lastName, Roles.PATIENT, result._id)
                return makeResponse(res, 201, "Patient Created Successfully", result, false);
                
                // if(){
                //     return makeResponse(res, 201, "Patient Created Successfully", result, false);
                // }else {
                //     return makeResponse(res, 201, "Something went wrong while creating patient", result, false);
                // };
            })
            .catch(err => {
                return makeResponse(res, 400, err.message, null, true);
            });
    }else {
        return makeResponse(res, 400, "Validation Failed", null, true);
    } 
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
                            UserController.createUserFromEmailAndPassword(req, res, email, password, firstName + " " + lastName, Roles.PATIENT, result._id);
                            createAppointmentByNurse(req, res, next, time, doctorId, result._id, nurse[0].hospitalId);
                            return makeResponse(res, 201, "Patient Created Successfully", result, false);
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
}

const getAllPatients = async (req: Request, res: Response, next: NextFunction) => {

    const { role, reference_id } = res.locals.jwt;
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
    const total = await Appointment.find({ hospitalId }).countDocuments({});

    Appointment.find({ hospitalId }).limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page).populate('patientId')
        .then(result => {
            const patients = result.map(item => ( item.patientId ))

            return makeResponse(res, 200, "All Patients", {totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), patients }, false);
        })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true);
        })

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
                    return makeResponse(res, 400, err.message, null, true);
                })
        })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true);
        })
};

const updatePatient = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const filter = { _id: id };
    let update = {...req.body};

    Patient.findOneAndUpdate(filter, update).then(updatedPatient => {
        return makeResponse(res, 200, "Patient updated Successfully", updatedPatient, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

const deletePatient = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    try {
        const patient = await Patient.findByIdAndDelete(_id);
    if (!patient) return res.sendStatus(404);
        await UserController.deleteUserWithEmail(patient.email)
        await Appointment.deleteMany({ patientId: patient._id});
        return makeResponse(res, 200, "Deleted Successfully", patient, false);
    } catch (e) {
        return res.sendStatus(400);
    }
};

export default { 
    createPatient, 
    getAllPatients,
    getSinglePatient,
    updatePatient,
    deletePatient,
    createPatientFromNurse
};
