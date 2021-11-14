import { NextFunction, Request, Response } from 'express';
import makeResponse, { sendErrorResponse } from '../functions/makeResponse';
import Appointment from '../models/appointment';
import { SERVER_ERROR_CODE } from '../constants/statusCode';
import Speciality from '../models/doctors/speciality';
import Hospital from '../models/hospital/hospital';

const NAMESPACE = "Home";

const getHomeData = async (req: Request, res: Response, next: NextFunction) => {

    const specialities = await Speciality.find({});
    const hospitals = await Hospital.find({}).limit(10).skip(0);

    Appointment.find({patientId: res.locals.jwt.reference_id})
        .populate("patientId")
        .populate("doctorId")
        .then(appointments => {
            return makeResponse(res, 200, "Patient Appointments", { upcommingAppointments: appointments, specialities, hospitals }, false);
        }).catch(err => {
            return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
        })
};

export default { 
    getHomeData
};
