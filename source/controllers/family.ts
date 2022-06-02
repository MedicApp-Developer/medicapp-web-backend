import { NextFunction, Request, Response } from 'express';
import Family from '../models/family';
import makeResponse, { sendErrorResponse } from '../functions/makeResponse';

import { DUPLICATE_VALUE_CODE, SERVER_ERROR_CODE } from '../constants/statusCode';
import User from '../models/user';

const NAMESPACE = "Patient";

const createFamilyMember = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { firstName, lastName, relation, emiratesId, phoneNo, patientId } = req.body;

                const user = await User.find({ emiratesId }).countDocuments();
                const family = await Family.find({ emiratesId }).countDocuments();

                if(user > 0 || family > 0) {
                    return sendErrorResponse(res, 400, "Emirates ID already exists", DUPLICATE_VALUE_CODE);
                }

                const newFamilyMember = new Family({
                    firstName, lastName, relation, emiratesId, phoneNo, patientId
                });

                const member = await newFamilyMember.save();

                return makeResponse(res, 200, "Family Member Added", member, false);

            } catch(err) {
                // @ts-ignore
                return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
            }
};

const deleteFamilyMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = req.params.id;
        const family = await Family.findByIdAndDelete(_id);
        
        if (!family) return res.sendStatus(404);
        return makeResponse(res, 200, "Deleted Successfully", family, false);

    } catch(err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
    }
};

export default { 
    createFamilyMember,
    deleteFamilyMember
};
