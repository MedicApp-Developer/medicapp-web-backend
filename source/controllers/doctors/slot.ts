import { NextFunction, Request, Response } from 'express';
import Slot from '../../models/doctors/slot';
import makeResponse, { sendErrorResponse } from '../../functions/makeResponse';
import { SlotStatus } from '../../constants/slot';
import { SERVER_ERROR_CODE } from '../../constants/statusCode';

const NAMESPACE = "Slot";

const createSlot = async (req: Request, res: Response, next: NextFunction) => {
        const { from, to, doctorId, hospitalId } = req.body;
    
        if(from && to && doctorId && hospitalId) {
            const newSlot = new Slot({
                from: new Date(from), to: new Date(to), doctorId, hospitalId
            });
            newSlot.save().then(result => {
                return makeResponse(res, 200, "Doctor", result, false);
            }).catch(err => {
                return makeResponse(res, 400, "Problem while creating the slot", null, true);
            })
        } else {
            return makeResponse(res, 400, "Validation Failed", null, true);
        }
};

const getDoctorAvailableSlots = async (req: Request, res: Response, next: NextFunction) => {
    const { doctorId } = req.params;
    const { startDate, endDate } = req.body;

    try {
        if(startDate === undefined || endDate === undefined) {
            const slots = await Slot.find({ status: SlotStatus.AVAILABLE, doctorId });
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
            }).populate('doctorId').populate('hospitalId');
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
            const slots = await Slot.find({ status: SlotStatus.BOOKED, doctorId });
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
            }).populate('doctorId').populate('hospitalId');
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
            const slots = await Slot.find({ doctorId });
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
            }).populate('doctorId').populate('hospitalId');
            return makeResponse(res, 201, "Doctor's All Slots", slots, false);
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
    getDoctorBookedSlots
};
