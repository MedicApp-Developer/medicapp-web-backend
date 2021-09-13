import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Appointment from '../models/appointment';
import makeResponse from '../functions/makeResponse';

const NAMESPACE = "Appointment";

const createAppointment = (req: Request, res: Response, next: NextFunction) => {
     const { time, doctorId, patientId } = req.body;

     const newAppointment = new Appointment({ time, doctorId, patientId });
     newAppointment.save().then(result => {
        return makeResponse(res, 201, "Appointment Created Successfully", result, false);
     })
     .catch(err => {
        return makeResponse(res, 400, err.message, null, true);
     });
};

const getAllAppointments = (req: Request, res: Response, next: NextFunction) => {
    Appointment.find({})
        .populate("doctorId")
        .populate("patientId")
        .then(result => {
            return makeResponse(res, 200, "All Appointments", result, false);
        })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true);
        })
};

const getSingleAppointment = (req: Request, res: Response, next: NextFunction) => {
    Appointment.findById({ _id: req.params.id })
        .populate("doctorId")
        .populate("patientId")
    .then(data => {
        return makeResponse(res, 200, "Appointment", data, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    })
};

const updateAppointment = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const filter = { _id: id };
    let update = {...req.body};

    Appointment.findOneAndUpdate(filter, update).then(updatedAppointment => {
        return makeResponse(res, 200, "Appointment updated Successfully", updatedAppointment, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

const deleteAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    try {
        const appointment = await Appointment.findByIdAndDelete(_id);
    if (!appointment) return res.sendStatus(404);
        return makeResponse(res, 200, "Deleted Successfully", appointment, false);
    } catch (e) {
        return res.sendStatus(400);
    }
};

export default { 
    createAppointment, 
    getAllAppointments,
    getSingleAppointment,
    updateAppointment,
    deleteAppointment
};
