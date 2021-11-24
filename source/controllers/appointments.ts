import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Appointment from '../models/appointment';
import makeResponse from '../functions/makeResponse';
import { Pagination } from '../constants/pagination';

const NAMESPACE = "Appointment";

const createAppointment = (req: Request, res: Response, next: NextFunction) => {
     const { time, doctorId, patientId, hospitalId } = req.body;

     const newAppointment = new Appointment({ time, doctorId, patientId, hospitalId });
     newAppointment.save().then(result => {
        return makeResponse(res, 201, "Appointment Created Successfully", result, false);
     })
     .catch(err => {
        return makeResponse(res, 400, err.message, null, true);
     });
};

const getAllAppointments = (req: Request, res: Response, next: NextFunction) => {
    Appointment.find({patientId: res.locals.jwt.reference_id })
        .select(['-hospitalId'])
        .populate("patientId")
        .populate({
            path : 'doctorId',
            populate: [
            { path: 'specialityId' },
            { path: 'hospitalId' }
            ]
        })
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

export const createAppointmentByNurse = (req: Request, res: Response, next: NextFunction, time: string, doctorId: string, patientId: string, hospitalId: string) => {
    
    const newAppointment = new Appointment({ time, doctorId, patientId, hospitalId });
    newAppointment.save().then(result => {
       return true;
    })
    .catch(err => {
       return false;
    });

};

export const getHospitalAppointments = (req: Request, res: Response, next: NextFunction) => {
    const { hospitalId } = req.params;
    
    Appointment.find({hospitalId})
        .populate("doctorId")
        .populate("patientId")
        .then(appointments => {
            return makeResponse(res, 200, "Hospital Appointments", appointments, false);
        }).catch(err => {
            return res.sendStatus(400);
        })
};

export const getDoctorAppointments = async (req: Request, res: Response, next: NextFunction) => {
    const { doctorId } = req.params;
    // @ts-ignore
    const page = parseInt(req.query.page || "0");
    const total = await Appointment.find({doctorId}).countDocuments({});

    Appointment.find({doctorId})
        .populate("patientId")
        .populate("doctorId")
        .limit(Pagination.PAGE_SIZE)
        .skip(Pagination.PAGE_SIZE * page)
        .then(appointments => {
            return makeResponse(res, 200, "Doctor Appointments", {totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), appointments}, false);
        }).catch(err => {
            return res.sendStatus(400);
        })
}

export default { 
    createAppointment, 
    getAllAppointments,
    getSingleAppointment,
    updateAppointment,
    deleteAppointment,
    getHospitalAppointments,
    getDoctorAppointments
};
