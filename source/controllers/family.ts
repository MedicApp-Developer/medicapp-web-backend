import { NextFunction, Request, Response } from 'express';
import Family from '../models/family';
import makeResponse, { sendErrorResponse } from '../functions/makeResponse';

import { SERVER_ERROR_CODE } from '../constants/statusCode';

const NAMESPACE = "Patient";

const createFamilyMember = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { firstName, lastName, relation, emiratesId, patientId } = req.body;

                const newFamilyMember = new Family({
                    firstName, lastName, relation, emiratesId, patientId
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
