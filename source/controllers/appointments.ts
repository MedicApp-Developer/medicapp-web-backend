import { NextFunction, Request, Response } from 'express'
import Appointment from '../models/appointment'
import makeResponse, { sendErrorResponse } from '../functions/makeResponse'
import { Pagination } from '../constants/pagination'
import { PARAMETER_MISSING_CODE, RECORD_NOT_FOUND, SERVER_ERROR_CODE } from '../constants/statusCode'
import Slot from '../models/doctors/slot'
import { SlotStatus, SlotTypes } from '../constants/slot'
import Patient from '../models/patient'
import PointsCode from '../models/pointsCode'
import { POINTS_CODE } from '../constants/rewards'
import sendMessage from '../functions/sendSms'
import Hospital from '../models/hospital/hospital'
import Doctor from '../models/doctors/doctor'
import moment from 'moment'

const NAMESPACE = "Appointment"

const createAppointment = (req: Request, res: Response, next: NextFunction) => {

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


                    // @ts-ignore
                    const message = `Appointment Confirmed!\nPatient Name: ${patientInfo?.firstName + " " + patientInfo?.lastName}\nClinic Name: ${hospitalInfo?.name}\nDoctor Name: ${doctorInfo?.firstName + " " + doctorInfo?.lastName}\nDate & Time: ${moment(slotInfo?.from).format('MMMM Do YYYY, h:mm:ss a')}\nClinic Location: ${hospitalInfo?.address}`
                    // @ts-ignore
                    sendMessage(patientInfo?.phone.slice(1).replace(/\s+/g, ''), message);
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

const cancelAppointment = (req: Request, res: Response, next: NextFunction) => {

    const { slotId } = req.params

    if (slotId) {
        try {
            const filter = { _id: slotId }
            let update = { patientId: null, status: SlotStatus.AVAILABLE, description: "", familyMemberId: null, type: SlotTypes.DOCTOR }

            // @ts-ignore
            Slot.findOneAndUpdate(filter, update, { upsert: true }).then(updatedSlot => {
                return makeResponse(res, 200, "Updated Slot", updatedSlot, false)
            }).catch(err => {
                return sendErrorResponse(res, 400, "No slot with this ID", RECORD_NOT_FOUND)
            })

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
                { path: 'hospitalId' }
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
        .limit(Pagination.PAGE_SIZE)
        .skip(Pagination.PAGE_SIZE * page)
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
