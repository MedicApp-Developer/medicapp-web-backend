import { NextFunction, Request, Response } from 'express';
import makeResponse, { sendErrorResponse } from '../functions/makeResponse';
import Appointment from '../models/appointment';
import { SERVER_ERROR_CODE } from '../constants/statusCode';
import Speciality from '../models/doctors/speciality';

const NAMESPACE = "Home";

const getHomeData = async (req: Request, res: Response, next: NextFunction) => {

    const specialities = await Speciality.find({});

    Appointment.find({patientId: res.locals.jwt.reference_id})
        .populate("patientId")
        .populate("doctorId")
        .then(appointments => {
            return makeResponse(res, 200, "Patient Appointments", { upcommingAppointments: appointments, specialities }, false);
        }).catch(err => {
            return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
        })
};

export default { 
    getHomeData
};
