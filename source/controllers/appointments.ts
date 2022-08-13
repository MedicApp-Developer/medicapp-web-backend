import { NextFunction, Request, Response } from 'express'
import Appointment from '../models/appointment'
import makeResponse, { sendErrorResponse } from '../functions/makeResponse'
import { sendNoReplyEmail } from '../functions/noReplyMailer'
import { Pagination } from '../constants/pagination'
import { PARAMETER_MISSING_CODE, RECORD_NOT_FOUND, SERVER_ERROR_CODE } from '../constants/statusCode'
import Slot from '../models/doctors/slot'
import { SlotStatus, SlotTypes } from '../constants/slot'
import Patient from '../models/patient'
import PointsCode from '../models/pointsCode'
import { POINTS_CODE } from '../constants/rewards'
import sendMessage from '../functions/sendSms'
import config from '../config/config'
import Hospital from '../models/hospital/hospital'
import Doctor from '../models/doctors/doctor'
import moment from 'moment-timezone'
import fs from 'fs';
import path from 'path';

const prettylink = require('prettylink');

const NAMESPACE = "Appointment"

const createAppointment = (req: Request, res: Response, next: NextFunction) => {

    const timezone = req.headers.timezone !== undefined ? req.headers.timezone : ''
    const { patientId, slotId, description, familyMemberId } = req.body

    if (patientId && slotId) {
        try {
            const filter = { _id: slotId }
            let update = { patientId, status: SlotStatus.BOOKED, description, familyMemberId }

            Slot.findOneAndUpdate(filter, update, { upsert: true }).then(async updatedSlot => {

                await new PointsCode({
                    code: Math.floor(Math.random() * 10000000) + 1,
                    patientId,
                    // @ts-ignore
                    hospitalId: updatedSlot.hospitalId, slotId
                }).save();

                const slotInfo = await Slot.findById(slotId);
                if (slotInfo) {
                    const hospitalInfo = await Hospital.findById(slotInfo.hospitalId);
                    const doctorInfo = await Doctor.findById(slotInfo.doctorId);
                    const patientInfo = await Patient.findById(slotInfo.patientId);



                    const locationUrl = `https://www.google.com/maps/search/?api=1&query=${JSON.parse(JSON.stringify(hospitalInfo?.location)).coordinates[0]},${JSON.parse(JSON.stringify(hospitalInfo?.location)).coordinates[1]}`



                    // Init Access Token in constructor 
                    const bitly = new prettylink.Bitly(process.env.BITLY_ACCESS_TOKEN);

                    bitly.short(locationUrl).then((result: any) => {
                        // @ts-ignore
                        const message = `Appointment Confirmed!\nPatient Name: ${patientInfo?.firstName + " " + patientInfo?.lastName}\nClinic Name: ${hospitalInfo?.name}\nDoctor Name: ${doctorInfo?.firstName + " " + doctorInfo?.lastName}\nDate & Time: ${moment.tz(slotInfo?.from, 'Asia/Dubai').format('DD/MM/YYYY, hh:mm: a')}\nClinic Location: ${result.link}\n\nDon't forget to ask the receptionist for your code to CLAIM YOUR POINTS!`
                        console.log(message);
                        // @ts-ignore
                        sendMessage(patientInfo?.phone.slice(1).replace(/\s+/g, '').replace(/-/g, ""), message);
                    }).catch((err: any) => {
                        console.log(err);
                    });


                    // send cancellation email to patient
                    const content = fs.readFileSync(path.join((`${__dirname}/../templates/AppointmentConfirmHospital.html`)));

                    let final_template = content.toString().replace('[name]', patientInfo?.firstName + " " + patientInfo?.lastName).toString().replace('[name]', patientInfo?.firstName + " " + patientInfo?.lastName).toString().replace('[clinic_name]', hospitalInfo?.name ?? "").toString().replace('[doctor_name]', doctorInfo?.firstName + " " + doctorInfo?.lastName).toString().replace('[date]', moment.tz(slotInfo?.from, timezone as string).format('DD/MM/YYYY, hh:mm: a'));


                    const options = {
                        from: config.mailer.user,
                        to: hospitalInfo?.email,
                        subject: "New Appointment Booked",
                        html: final_template
                    }

                    sendNoReplyEmail(options, false);

                }

                return makeResponse(res, 200, "Appointment booked", updatedSlot, false)
            }).catch(err => {
                return sendErrorResponse(res, 400, "No slot with this ID", RECORD_NOT_FOUND)
            })

        } catch (err) {
            return sendErrorResponse(res, 400, "Validation Failed", SERVER_ERROR_CODE)
        }
    } else {
        return sendErrorResponse(res, 400, "Validation Failed", PARAMETER_MISSING_CODE)
    }
}

const cancelAppointment = async (req: Request, res: Response, next: NextFunction) => {

    const timezone = req.headers.timezone !== undefined ? req.headers.timezone : ''
    const { slotId } = req.params

    if (slotId) {
        try {
            const filter = { _id: slotId }
            let update = { patientId: null, status: SlotStatus.AVAILABLE, description: "", familyMemberId: null, type: SlotTypes.DOCTOR }

            const slotInfo = await Slot.findById(slotId);
            if (slotInfo) {

                const hospitalInfo = await Hospital.findById(slotInfo.hospitalId);
                const doctorInfo = await Doctor.findById(slotInfo.doctorId);
                const patientInfo = await Patient.findById(slotInfo.patientId);
                // @ts-ignore
                const message = `Appointment Cancelled!\nPatient Name: ${patientInfo?.firstName + " " + patientInfo?.lastName}\nClinic Name: ${hospitalInfo?.name}\nDoctor Name: ${doctorInfo?.firstName + " " + doctorInfo?.lastName}\nDate & Time: ${moment.tz(slotInfo?.from, timezone).format('DD/MM/YYYY, hh:mm: a')}`
                console.log(message);
                // @ts-ignore
                Slot.findOneAndUpdate(filter, update, { upsert: true }).then(async updatedSlot => {
                    // @ts-ignore
                    sendMessage(patientInfo?.phone.slice(1).replace(/\s+/g, '').replace(/-/g, ""), message);

                    // send cancellation email to hospital
                    const contentHospital = fs.readFileSync(path.join((`${__dirname}/../templates/AppointmentCancelHospital.html`)));

                    let hospital_template = contentHospital.toString().replace('[name]', patientInfo?.firstName + " " + patientInfo?.lastName).toString().replace('[name]', patientInfo?.firstName + " " + patientInfo?.lastName).toString().replace('[clinic_name]', hospitalInfo?.name ?? "").toString().replace('[doctor_name]', doctorInfo?.firstName + " " + doctorInfo?.lastName).toString().replace('[date]', moment.tz(slotInfo?.from, timezone as string).format('DD/MM/YYYY, hh:mm: a'));


                    const hospitalOptions = {
                        from: config.mailer.user,
                        to: hospitalInfo?.email,
                        subject: "Appointment Cancelled",
                        html: hospital_template
                    }

                    sendNoReplyEmail(hospitalOptions, false);
                    return makeResponse(res, 200, "Updated Slot", updatedSlot, false)
                }).catch(err => {
                    return sendErrorResponse(res, 400, "No slot with this ID", RECORD_NOT_FOUND)
                })
            } else {
                return sendErrorResponse(res, 400, "No slot with this ID", RECORD_NOT_FOUND)
            }


        } catch (err) {
            return sendErrorResponse(res, 400, "Validation Failed Error", SERVER_ERROR_CODE)
        }
    } else {
        return sendErrorResponse(res, 400, "Parameter missing", PARAMETER_MISSING_CODE)
    }
}

const getAllAppointments = (req: Request, res: Response, next: NextFunction) => {
    Slot.find({ patientId: res.locals.jwt.reference_id })
        .select(['-hospitalId'])
        .populate("patientId")
        .populate("familyMemberId")
        .populate({
            path: 'doctorId',
            populate: [
                { path: 'specialityId' },
                {
                    path: 'hospitalId',
                    populate: [
                        { path: 'insurances' }
                    ]
                }
            ]
        })
        .then(result => {
            return makeResponse(res, 200, "All Appointments", result, false)
        })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true)
        })
}

const getSingleAppointment = (req: Request, res: Response, next: NextFunction) => {
    Slot.findById({ _id: req.params.id })
        .populate("doctorId")
        .populate("familyMemberId")
        .populate("patientId")
        .then(data => {
            return makeResponse(res, 200, "Appointment", data, false)
        }).catch(err => {
            return makeResponse(res, 400, err.message, null, true)
        })
}

const updateAppointment = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const filter = { _id: id }
    let update = { ...req.body }

    Appointment.findOneAndUpdate(filter, update).then(updatedAppointment => {
        return makeResponse(res, 200, "Appointment updated Successfully", updatedAppointment, false)
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true)
    })
}

const deleteAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    try {
        const appointment = await Slot.findByIdAndDelete(_id)
        if (!appointment) return res.sendStatus(404)
        return makeResponse(res, 200, "Deleted Successfully", appointment, false)
    } catch (e) {
        return res.sendStatus(400)
    }
}

const deletePatientAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    const patientId = req.params.patientId
    try {

        const slot = await Slot.findById({ _id });

        const pointsCodeCount = await PointsCode.find({ slotId: slot?._id, status: POINTS_CODE.TAKEN }).countDocuments();

        let newPatient: any = null;
        // @ts-ignore
        if (pointsCodeCount > 0) {
            newPatient = await Patient.findOneAndUpdate({ _id: patientId }, { $inc: { points: -20 } }, { new: true })
        }

        await PointsCode.deleteOne({ slotId: _id });

        const filter = { _id }
        let update = { patientId: null, status: SlotStatus.AVAILABLE, description: "", familyMemberId: null }

        // @ts-ignore
        await Slot.findOneAndUpdate(filter, update, { upsert: true })

        Slot.findById(_id).then(response => {
            Slot.find({ patientId })
                .populate("patientId")
                .populate("hospitalId")
                .populate("familyMemberId")
                .populate({
                    path: 'doctorId',
                    populate: [
                        { path: 'specialityId' },
                        { path: 'hospitalId' }
                    ]
                }).then(upcommingAppointments => {
                    return makeResponse(res, 200, "Patient Appointments", { upcommingAppointments, newPatient }, false)
                })
        })
    } catch (err) {
        return res.sendStatus(400)
    }
}


export const createAppointmentByNurse = (req: Request, res: Response, next: NextFunction, time: string, doctorId: string, patientId: string, hospitalId: string) => {

    const newAppointment = new Appointment({ time, doctorId, patientId, hospitalId })
    newAppointment.save().then(result => {
        return true
    })
        .catch(err => {
            return false
        })

}

export const getHospitalAppointments = (req: Request, res: Response, next: NextFunction) => {
    const { hospitalId } = req.params

    Slot.find({ hospitalId })
        .populate({
            path: 'doctorId',
            populate: [
                { path: 'specialityId' },
                { path: 'hospitalId' }
            ]
        })
        .populate("familyMemberId")
        .populate("patientId")
        .then(appointments => {
            return makeResponse(res, 200, "Hospital Appointments", appointments, false)
        }).catch(err => {
            return res.sendStatus(400)
        })
}

export const getDoctorAppointments = async (req: Request, res: Response, next: NextFunction) => {
    const { doctorId } = req.params
    // @ts-ignore
    const page = parseInt(req.query.page || "0")
    const total = await Slot.find({ doctorId }).countDocuments({})

    Slot.find({ doctorId })
        .populate("patientId")
        .populate("familyMemberId")
        .populate("doctorId")
        .then(appointments => {
            return makeResponse(res, 200, "Doctor Appointments", { totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), appointments }, false)
        }).catch(err => {
            return res.sendStatus(400)
        })
}

export const getDoctorApprovedAppointments = async (req: Request, res: Response, next: NextFunction) => {
    const { doctorId } = req.params
    // @ts-ignore
    const page = parseInt(req.query.page || "0")
    const total = await Slot.find({ doctorId, status: SlotStatus.BOOKED }).countDocuments({})

    Slot.find({ doctorId, status: SlotStatus.BOOKED })
        .populate("patientId")
        .populate("familyMemberId")
        .populate("doctorId")
        .limit(Pagination.PAGE_SIZE)
        .skip(Pagination.PAGE_SIZE * page)
        .then(appointments => {
            return makeResponse(res, 200, "Doctor BOOKED Appointments", { totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), appointments }, false)
        }).catch(err => {
            return res.sendStatus(400)
        })
}

export const getAllHospitalBookedAppointments = async (req: Request, res: Response, next: NextFunction) => {
    const { hospitalId } = req.params
    // @ts-ignore
    const page = parseInt(req.query.page || "0")
    const total = await Slot.find({ hospitalId, status: SlotStatus.BOOKED }).countDocuments({})

    Slot.find({ hospitalId, status: SlotStatus.BOOKED })
        .populate("patientId")
        .populate("familyMemberId")
        .populate("doctorId")
        .limit(Pagination.PAGE_SIZE)
        .skip(Pagination.PAGE_SIZE * page)
        .then(appointments => {
            return makeResponse(res, 200, "Hospital's Appointments", { totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), appointments }, false)
        }).catch(err => {
            return res.sendStatus(400)
        })
}

export const approvePatientAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const { slotId, patientId } = req.params
    // @ts-ignore

    if (slotId && patientId) {

        try {
            const filter = { _id: slotId }
            let update = { status: SlotStatus.APPROVED }

            // @ts-ignore
            await Slot.findOneAndUpdate(filter, update, { upsert: true });

            await Patient.findOneAndUpdate({ _id: patientId }, { $inc: { points: 20 } }, { new: true })

            return makeResponse(res, 200, "Hospital's Appointments", null, false)
        } catch (err) {
            return sendErrorResponse(res, 400, "Validation Failed Error", SERVER_ERROR_CODE)
        }

    } else {
        return sendErrorResponse(res, 400, "Parameter missing", PARAMETER_MISSING_CODE)
    }
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
    cancelAppointment,
    getAllHospitalBookedAppointments,
    approvePatientAppointment,
    getDoctorApprovedAppointments
}
