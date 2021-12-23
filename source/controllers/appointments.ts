import { NextFunction, Request, Response } from 'express';
import Appointment from '../models/appointment';
import makeResponse, { sendErrorResponse } from '../functions/makeResponse';
import { Pagination } from '../constants/pagination';
import { PARAMETER_MISSING_CODE, RECORD_NOT_FOUND, SERVER_ERROR_CODE } from '../constants/statusCode';
import Slot from '../models/doctors/slot';
import { SlotStatus } from '../constants/slot';

const NAMESPACE = "Appointment";

const createAppointment = (req: Request, res: Response, next: NextFunction) => {
    
    const { patientId, slotId } = req.body;

    if(patientId && slotId) {
        try {
            const filter = { _id: slotId };
            let update = { patientId, status: SlotStatus.BOOKED };
            
            Slot.findOneAndUpdate(filter, update, { upsert: true }).then(updatedSlot => {
                return makeResponse(res, 200, "Updated Slot", updatedSlot, false);
            }).catch(err => {
                return sendErrorResponse(res, 400, "No slot with this ID", RECORD_NOT_FOUND);
            })
    
        } catch(err) {
            return sendErrorResponse(res, 400, "Validation Failed", SERVER_ERROR_CODE);
        }
    }else {
        return sendErrorResponse(res, 400, "Validation Failed", PARAMETER_MISSING_CODE);
    }
};

const cancelAppointment = (req: Request, res: Response, next: NextFunction) => {
    
    const { slotId } = req.body;

    if(slotId) {
        try {
            const filter = { _id: slotId };
            let update = { patientId: null, status: SlotStatus.AVAILABLE };
            
            // @ts-ignore
            Slot.findOneAndUpdate(filter, update, { upsert: true }).then(updatedSlot => {
                return makeResponse(res, 200, "Updated Slot", updatedSlot, false);
            }).catch(err => {
                return sendErrorResponse(res, 400, "No slot with this ID", RECORD_NOT_FOUND);
            })
    
        } catch(err) {
            return sendErrorResponse(res, 400, "Validation Failed", SERVER_ERROR_CODE);
        }
    }else {
        return sendErrorResponse(res, 400, "Validation Failed", PARAMETER_MISSING_CODE);
    }
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

const deletePatientAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const patientId = req.params.patientId;
    try {
        Appointment.findByIdAndDelete(_id).then(response => {
            Appointment.find({ patientId }).select(['-hospitalId'])
            .populate("patientId")
            .populate({
                path : 'doctorId',
                populate: [
                  { path: 'specialityId' },
                  { path: 'hospitalId' }
                ]
              }).then(upcommingAppointments => {
                return makeResponse(res, 200, "Patient Appointments", upcommingAppointments, false);  
              })
        });
    } catch(err) {
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
    getDoctorAppointments,
    deletePatientAppointment,
    cancelAppointment
};
