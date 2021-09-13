import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Patient from '../models/patient';
import makeResponse from '../functions/makeResponse';
import UserController from '../controllers/user';
import { Roles } from '../constants/roles';
import config from '../config/config';

const NAMESPACE = "Patient";

const createPatient = (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName, birthday, gender, emiratesId, location } = req.body;
    if(req && req.file && req.file.filename && email && password && firstName && lastName && birthday && gender && emiratesId && location ){
        const newPatient = new Patient({
            _id: new mongoose.Types.ObjectId(),
            email, firstName, lastName, birthday, gender, emiratesId, location,
            emiratesIdFile: config.server.APP_URL + "/" + (( req && req.file && req.file.filename ) ? req.file.filename : "")
        }); 

        return newPatient.save()
            .then(result => {
                if(UserController.createUserFromEmailAndPassword(req, res, email, password, firstName + " " + lastName, Roles.PATIENT, result._id)){
                    return makeResponse(res, 201, "Patient Created Successfully", result, false);
                }else {
                    return makeResponse(res, 201, "Something went wrong while creating patient", result, false);
                };
            })
            .catch(err => {
                return makeResponse(res, 400, err.message, null, true);
            });
    }else {
        return makeResponse(res, 400, "Validation Failed", null, true);
    } 
};

const getAllPatients = (req: Request, res: Response, next: NextFunction) => {
    Patient.find({})
        .then(result => {
            return makeResponse(res, 200, "All Patients", result, false);
        })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true);
        })
};

const getSinglePatient = (req: Request, res: Response, next: NextFunction) => {
    Patient.findById({ _id: req.params.id })
    .then(data => {
        return makeResponse(res, 200, "Patient", data, false);
    }).catch(err => {
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
        if(UserController.deleteUserWithEmail(patient.email)){
            return makeResponse(res, 200, "Deleted Successfully", patient, false);
        }else {
            return makeResponse(res, 400, "Error while deleting patient", null, true);
        }
    } catch (e) {
        return res.sendStatus(400);
    }
};

export default { 
    createPatient, 
    getAllPatients,
    getSinglePatient,
    updatePatient,
    deletePatient
};
