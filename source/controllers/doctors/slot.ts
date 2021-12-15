import { NextFunction, Request, Response } from 'express';
import Slot from '../../models/doctors/slot';
import makeResponse, { sendErrorResponse } from '../../functions/makeResponse';

const NAMESPACE = "Slot";

const createSlot = async (req: Request, res: Response, next: NextFunction) => {
        const { from, to, doctorId, hospitalId } = req.body;
    
        if(from && to && doctorId && hospitalId) {
            const newSlot = new Slot({
                from, to, doctorId, hospitalId
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

export default { 
    createSlot
};
