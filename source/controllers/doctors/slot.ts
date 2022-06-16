import { NextFunction, Request, Response } from 'express'
import Slot from '../../models/doctors/slot'
import makeResponse, { sendErrorResponse } from '../../functions/makeResponse'
import { SlotStatus, SlotTypes } from '../../constants/slot'
import { SERVER_ERROR_CODE } from '../../constants/statusCode'
import pdf from 'html-pdf'
import generateAppointmentSlip from '../../documents/AppointmentSlip'
import path from 'path'
import Patient from '../../models/patient'

const NAMESPACE = "Slot"

const createSlot = async (req: Request, res: Response, next: NextFunction) => {
    const { from, to, doctorId, hospitalId, type } = req.body

    if (type === SlotTypes.PCR_TEST || type === SlotTypes.PCR_VACCINATION) {
        if (!(from && to && hospitalId)) {
            return makeResponse(res, 400, "Validation Failed", null, true)
        }
    } else {
        if (!(from && to && doctorId && hospitalId)) {
            return makeResponse(res, 400, "Validation Failed", null, true)
        }
    }

    try {
        const newSlot = new Slot({
            from: new Date(from), to: new Date(to), doctorId, hospitalId, type: type ? type : SlotTypes.DOCTOR
        })
        newSlot.save().then(result => {
            return makeResponse(res, 200, "Doctor", result, false)
        }).catch(err => {
            return makeResponse(res, 400, "Problem while creating the slot", null, true)
        })
    } catch (err) {
        // @ts-ignore
        return makeResponse(res, 400, err.message, null, true)
    }
}

const createMedicappSlot = async (req: Request, res: Response, next: NextFunction) => {
    const { from, to, patientId, description, familyMemberId } = req.body

    if (!(from && to && patientId)) {
        return makeResponse(res, 400, "Validation Failed", null, true)
    }

    try {
        const newSlot = new Slot({
            from: new Date(from), to: new Date(to), type: SlotTypes.MEDICAPP_PCR, patientId, description, familyMemberId, status: SlotStatus.BOOKED
        })

        await Patient.findOneAndUpdate({ _id: patientId }, { $inc: { points: 20 } }, { new: true })

        const result = await newSlot.save();

        return makeResponse(res, 200, "MEDICAPP Slot Created", result, false)
    } catch (err) {
        // @ts-ignore
        return makeResponse(res, 400, err.message, null, true)
    }
}

const getPatientMedicappBookedSlots = async (req: Request, res: Response, next: NextFunction) => {
    const { patientId } = req.params
    const { startDate, endDate } = req.body

    try {
        if (startDate === undefined || endDate === undefined) {
            const slots = await Slot.find({ status: SlotStatus.BOOKED, patientId, type: SlotTypes.MEDICAPP_PCR }).populate('patientId').populate('familyMemberId')
            return makeResponse(res, 201, "Patient's MEDICAPP Available Slots", slots, false)
        } else {
            const slots = await Slot.find({
                // @ts-ignore
                status: SlotStatus.BOOKED,
                patientId,
                type: SlotTypes.MEDICAPP_PCR,
                to: {
                    // @ts-ignore
                    $gte: new Date(new Date(startDate).setHours(0o0, 0o0, 0o0)),
                    $lte: new Date(new Date(endDate).setHours(23, 59, 59))
                }
            }).populate('patientId').populate('familyMemberId')
            return makeResponse(res, 201, "Patient's MEDICAPP Booked Slots", slots, false)
        }
    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const getDoctorAvailableSlots = async (req: Request, res: Response, next: NextFunction) => {
    const { doctorId } = req.params
    const { startDate, endDate } = req.body

    try {
        if (startDate === undefined || endDate === undefined) {
            const slots = await Slot.find({ status: SlotStatus.AVAILABLE, doctorId }).populate('doctorId').populate('hospitalId').populate('patientId').populate('familyMemberId')
            return makeResponse(res, 201, "Doctor's Available Slots", slots, false)
        } else {
            console.log(startDate);

            const slots = await Slot.find({
                // @ts-ignore
                status: SlotStatus.AVAILABLE,
                doctorId,
                from: {
                    // @ts-ignore
                    $gte: startDate,
                    $lte: endDate
                }
            }).populate('doctorId').populate('hospitalId').populate('patientId').populate('familyMemberId')
            return makeResponse(res, 201, "Doctor's Available Slots", slots, false)
        }
    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const getDoctorBookedSlots = async (req: Request, res: Response, next: NextFunction) => {
    const { doctorId } = req.params
    const { startDate, endDate } = req.body

    try {
        if (startDate === undefined || endDate === undefined) {
            const slots = await Slot.find({ status: SlotStatus.BOOKED, doctorId }).populate('doctorId').populate('hospitalId').populate('patientId').populate('familyMemberId')
            return makeResponse(res, 201, "Doctor's Booked Slots", slots, false)
        } else {
            const slots = await Slot.find({
                // @ts-ignore
                status: SlotStatus.BOOKED,
                doctorId,
                to: {
                    // @ts-ignore
                    $gte: new Date(new Date(startDate).setHours(0o0, 0o0, 0o0)),
                    $lte: new Date(new Date(endDate).setHours(23, 59, 59))
                }
            }).populate('doctorId').populate('hospitalId').populate('patientId').populate('familyMemberId')
            return makeResponse(res, 201, "Doctor's Booked Slots", slots, false)
        }

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const getDoctorAllSlots = async (req: Request, res: Response, next: NextFunction) => {
    const { doctorId } = req.params
    const { startDate, endDate } = req.body

    try {
        if (startDate === undefined || endDate === undefined) {
            const slots = await Slot.find({ doctorId }).populate('doctorId').populate('hospitalId').populate('patientId').populate('familyMemberId')
            return makeResponse(res, 201, "Doctor's All Slots", slots, false)
        } else {
            const slots = await Slot.find({
                // @ts-ignore
                doctorId,
                to: {
                    // @ts-ignore
                    $gte: new Date(new Date(startDate).setHours(0o0, 0o0, 0o0)),
                    $lte: new Date(new Date(endDate).setHours(23, 59, 59))
                }
            }).populate('doctorId').populate('hospitalId').populate('patientId').populate('familyMemberId')
            return makeResponse(res, 201, "Doctor's All Slots", slots, false)
        }

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const getDoctorApprovedSlots = async (req: Request, res: Response, next: NextFunction) => {
    const { doctorId } = req.params

    try {
        const slots = await Slot.find({ doctorId, status: SlotStatus.BOOKED }).populate('doctorId').populate('hospitalId').populate('patientId').populate('familyMemberId')
        return makeResponse(res, 201, "Doctor's BOOKED Slots", slots, false)

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const getHospitalPCRTestSlots = async (req: Request, res: Response, next: NextFunction) => {
    const { hospitalId } = req.params
    const { startDate, endDate } = req.body

    try {
        if (startDate === undefined || endDate === undefined) {
            const slots = await Slot.find({ hospitalId, type: SlotTypes.PCR_TEST }).populate('hospitalId').populate('patientId').populate('familyMemberId')
            return makeResponse(res, 201, "Hospital's PCR Test Slots", slots, false)
        } else {
            const slots = await Slot.find({
                // @ts-ignore
                hospitalId,
                type: SlotTypes.PCR_TEST,
                to: {
                    // @ts-ignore
                    $gte: new Date(new Date(startDate).setHours(0o0, 0o0, 0o0)),
                    $lte: new Date(new Date(endDate).setHours(23, 59, 59))
                }
            }).populate('hospitalId').populate('patientId').populate('familyMemberId')
            return makeResponse(res, 201, "Hospital's PCR Test Slots", slots, false)
        }

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const getHospitalPCRVaccinationSlots = async (req: Request, res: Response, next: NextFunction) => {
    const { hospitalId } = req.params
    const { startDate, endDate } = req.body

    try {
        if (startDate === undefined || endDate === undefined) {
            const slots = await Slot.find({ hospitalId, type: SlotTypes.PCR_VACCINATION }).populate('hospitalId').populate('patientId').populate('familyMemberId')
            return makeResponse(res, 201, "Hospital's PCR Vaccination Slots", slots, false)
        } else {
            const slots = await Slot.find({
                // @ts-ignore
                hospitalId,
                type: SlotTypes.PCR_VACCINATION,
                to: {
                    // @ts-ignore
                    $gte: new Date(new Date(startDate).setHours(0o0, 0o0, 0o0)),
                    $lte: new Date(new Date(endDate).setHours(23, 59, 59))
                }
            }).populate('hospitalId').populate('patientId').populate('familyMemberId')
            return makeResponse(res, 201, "Hospital's PCR Vaccination Slots", slots, false)
        }

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const getAppointmentSlip = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    try {
        const slot = await Slot.find({ _id: id }).populate('hospitalId').populate('patientId').populate('familyMemberId').populate('doctorId')
        pdf.create(generateAppointmentSlip(slot[0]), {}).toFile('Appointment Slip.pdf', (err) => {
            if (err) {
                return Promise.reject()
            }

            return Promise.resolve().then(result => {
                res.sendFile(path.resolve('Appointment Slip.pdf'))
            })
        })

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const cancelMedicappAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    try {
        const slot = await Slot.deleteOne({ _id: id });

        // @ts-ignore
        await Patient.findOneAndUpdate({ _id: slot.patientId }, { $inc: { points: 20 } }, { new: true })

        return makeResponse(res, 200, "Appointment cancelled successfully", slot, false)
    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const deleteDoctorSlot = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    try {
        const slot = await Slot.deleteOne({ _id: id });

        return makeResponse(res, 200, "Slot deleted successfully", slot, false)
    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const getAllMedicappBookedAppointments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const slots = await Slot.find({ type: SlotTypes.MEDICAPP_PCR, status: SlotStatus.BOOKED }).populate("patientId");
        return makeResponse(res, 200, "Appointment cancelled successfully", slots, false)
    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

export default {
    createSlot,
    getDoctorAllSlots,
    getDoctorAvailableSlots,
    getDoctorBookedSlots,
    getHospitalPCRTestSlots,
    getHospitalPCRVaccinationSlots,
    getAppointmentSlip,
    createMedicappSlot,
    getPatientMedicappBookedSlots,
    cancelMedicappAppointment,
    deleteDoctorSlot,
    getAllMedicappBookedAppointments,
    getDoctorApprovedSlots
}
