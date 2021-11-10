import { NextFunction, Request, Response } from 'express';
import makeResponse from '../../functions/makeResponse';
import Speciality from '../../models/doctors/speciality';
import { sendErrorResponse } from '../../functions/makeResponse';
import { RECORD_NOT_FOUND, SERVER_ERROR_CODE, UNAUTHORIZED_CODE } from '../../constants/statusCode';

const NAMESPACE = "Speciality";

const createSpeciality = (req: Request, res: Response, next: NextFunction) => {
     const { name } = req.body;

     const newSpeciality = new Speciality({ name });
     newSpeciality.save().then(speciality => {
        return makeResponse(res, 201, "Speciality Created Successfully", speciality, false);
     })
     .catch(err => {
        return sendErrorResponse(res, 400, "Unable to create speciality", SERVER_ERROR_CODE);
     });
};

const getAllSpeciality = (req: Request, res: Response, next: NextFunction) => {
    Speciality.find({})
        .then(specialities => {
            return makeResponse(res, 200, "All Specialities", specialities, false);
        })
        .catch(err => {
            return sendErrorResponse(res, 400, "No Record Found", RECORD_NOT_FOUND);
        })
};

const getSingleSpeciality = (req: Request, res: Response, next: NextFunction) => {
    Speciality.findById({ _id: req.params.id })
    .then(data => {
        return makeResponse(res, 200, "Speciality", data, false);
    }).catch(err => {
        return sendErrorResponse(res, 400, "No Record Found", RECORD_NOT_FOUND);
    })
};

const updateSpeciality = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const filter = { _id: id };
    let update = {...req.body};

    Speciality.findOneAndUpdate(filter, update).then(updatedSpeciality => {
        return makeResponse(res, 200, "Speciality updated Successfully", updatedSpeciality, false);
    }).catch(err => {
        return sendErrorResponse(res, 400, "Unable to update record", SERVER_ERROR_CODE);
    });
};

const deleteSpeciality = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    try {
        const speciality = await Speciality.findByIdAndDelete(_id);
    if (!speciality) return res.sendStatus(404);
        return makeResponse(res, 200, "Deleted Successfully", speciality, false);
    } catch (e) {
        return sendErrorResponse(res, 400, "Unable to delete record", SERVER_ERROR_CODE);
    }
};

export default { 
    createSpeciality, 
    getAllSpeciality,
    getSingleSpeciality,
    updateSpeciality,
    deleteSpeciality
};
