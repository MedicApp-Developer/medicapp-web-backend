import { NextFunction, Request, Response } from 'express';
import Slot from '../../models/doctors/slot';
import makeResponse, { sendErrorResponse } from '../../functions/makeResponse';
import { SlotStatus, SlotTypes } from '../../constants/slot';
import { SERVER_ERROR_CODE } from '../../constants/statusCode';

const NAMESPACE = "Slot";

const createSlot = async (req: Request, res: Response, next: NextFunction) => {
        const { from, to, doctorId, hospitalId, type } = req.body;

        if(type === SlotTypes.PCR_TEST || type === SlotTypes.PCR_VACCINATION) {
            if(!(from && to && hospitalId)) {
                return makeResponse(res, 400, "Validation Failed", null, true);
            }
        }else {
            if(!(from && to && doctorId && hospitalId)) {
                return makeResponse(res, 400, "Validation Failed", null, true);                
            }
        }

        try {
            const newSlot = new Slot({
                from: new Date(from), to: new Date(to), doctorId, hospitalId, type: type ? type : SlotTypes.DOCTOR
            });
            newSlot.save().then(result => {
                return makeResponse(res, 200, "Doctor", result, false);
            }).catch(err => {
                return makeResponse(res, 400, "Problem while creating the slot", null, true);
            })
        } catch(err) {
            // @ts-ignore
            return makeResponse(res, 400, err.message, null, true);         
        } 
};

const getDoctorAvailableSlots = async (req: Request, res: Response, next: NextFunction) => {
    const { doctorId } = req.params;
    const { startDate, endDate } = req.body;

    try {
        if(startDate === undefined || endDate === undefined) {
            const slots = await Slot.find({ status: SlotStatus.AVAILABLE, doctorId }).populate('doctorId').populate('hospitalId').populate('patientId').populate('familyMemberId');
            return makeResponse(res, 201, "Doctor's Available Slots", slots, false);
        } else {
            const slots = await Slot.find({ 
                // @ts-ignore
                status: SlotStatus.AVAILABLE, 
                doctorId,
                to: {
                    // @ts-ignore
                    $gte: new Date(new Date(startDate).setHours(0o0, 0o0, 0o0)),
                    $lte: new Date(new Date(endDate).setHours(23, 59, 59))
                } 
            }).populate('doctorId').populate('hospitalId').populate('patientId').populate('familyMemberId');
            return makeResponse(res, 201, "Doctor's Available Slots", slots, false);
        }
    } catch(err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
    }   
};

const getDoctorBookedSlots = async (req: Request, res: Response, next: NextFunction) => {
    const { doctorId } = req.params;
    const { startDate, endDate } = req.body;

    try {
        if(startDate === undefined || endDate === undefined) {
            const slots = await Slot.find({ status: SlotStatus.BOOKED, doctorId }).populate('doctorId').populate('hospitalId').populate('patientId').populate('familyMemberId');
            return makeResponse(res, 201, "Doctor's Booked Slots", slots, false);
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
            }).populate('doctorId').populate('hospitalId').populate('patientId').populate('familyMemberId');
            return makeResponse(res, 201, "Doctor's Booked Slots", slots, false);
        }
        
    } catch(err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
    }    
};

const getDoctorAllSlots = async (req: Request, res: Response, next: NextFunction) => {
    const { doctorId } = req.params;
    const { startDate, endDate } = req.body;

    try {
        if(startDate === undefined || endDate === undefined) {
            const slots = await Slot.find({ doctorId }).populate('doctorId').populate('hospitalId').populate('patientId').populate('familyMemberId');
            return makeResponse(res, 201, "Doctor's All Slots", slots, false);
        } else {
            const slots = await Slot.find({ 
                // @ts-ignore
                doctorId,
                to: {
                    // @ts-ignore
                    $gte: new Date(new Date(startDate).setHours(0o0, 0o0, 0o0)),
                    $lte: new Date(new Date(endDate).setHours(23, 59, 59))
                } 
            }).populate('doctorId').populate('hospitalId').populate('patientId').populate('familyMemberId');
            return makeResponse(res, 201, "Doctor's All Slots", slots, false);
        }
        
    } catch(err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
    }    
};

const getHospitalPCRTestSlots = async (req: Request, res: Response, next: NextFunction) => {
    const { hospitalId } = req.params;
    const { startDate, endDate } = req.body;

    try {
        if(startDate === undefined || endDate === undefined) {
            const slots = await Slot.find({ hospitalId, type: SlotTypes.PCR_TEST }).populate('hospitalId').populate('patientId').populate('familyMemberId');
            return makeResponse(res, 201, "Hospital's PCR Test Slots", slots, false);
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
            }).populate('hospitalId').populate('patientId').populate('familyMemberId');
            return makeResponse(res, 201, "Hospital's PCR Test Slots", slots, false);
        }
        
    } catch(err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
    }    
};

const getHospitalPCRVaccinationSlots = async (req: Request, res: Response, next: NextFunction) => {
    const { hospitalId } = req.params;
    const { startDate, endDate } = req.body;

    try {
        if(startDate === undefined || endDate === undefined) {
            const slots = await Slot.find({ hospitalId, type: SlotTypes.PCR_VACCINATION }).populate('hospitalId').populate('patientId').populate('familyMemberId');
            return makeResponse(res, 201, "Hospital's PCR Vaccination Slots", slots, false);
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
            }).populate('hospitalId').populate('patientId').populate('familyMemberId');
            return makeResponse(res, 201, "Hospital's PCR Vaccination Slots", slots, false);
        }
        
    } catch(err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
    }    
};

export default { 
    createSlot,
    getDoctorAllSlots,
    getDoctorAvailableSlots,
    getDoctorBookedSlots,
    getHospitalPCRTestSlots,
    getHospitalPCRVaccinationSlots
};
