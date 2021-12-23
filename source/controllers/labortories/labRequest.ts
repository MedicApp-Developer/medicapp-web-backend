import { NextFunction, Request, Response } from 'express';
import { Pagination } from '../../constants/pagination';
import { Roles } from '../../constants/roles';
import makeResponse from '../../functions/makeResponse';
import LaboratoryRequest from '../../models/labortories/labRequest';

const NAMESPACE = "Labortory Request";

const createLabRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { slotId, doctorId, patientId, laboratoryId, tests } = req.body;
    
    const newlabRequest = new LaboratoryRequest(
        { slotId, doctorId, patientId, laboratoryId, tests }
    );

    return newlabRequest.save()
    .then(result => {
        return makeResponse(res, 201, "Lab Request Created Successfully", result, false);
    })
    .catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

const getLabRequests = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const page = parseInt(req.query.page || "0");
    const status = req.query.status;
    const { role } = res.locals.jwt;

    if(role === Roles.LABORTORY){
        // @ts-ignore
        const total = await LaboratoryRequest.find({ laboratoryId: res.locals.jwt.reference_id, status }).countDocuments({});

        // @ts-ignore
        LaboratoryRequest.find({ laboratoryId: res.locals.jwt.reference_id, status }).limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page).populate('patientId').populate('doctorId')
            .then(result => {
                return makeResponse(res, 200, "All Lab Results", {totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), labResults: result}, false);
            })
            .catch(err => {
                return makeResponse(res, 400, err.message, null, true);
            })
    }else {
        // @ts-ignore
        const total = await LaboratoryRequest.find({ doctorId: res.locals.jwt.reference_id, status }).countDocuments({});

        // @ts-ignore
        LaboratoryRequest.find({ doctorId: res.locals.jwt.reference_id, status }).limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page).populate('patientId').populate('doctorId')
            .then(result => {
                return makeResponse(res, 200, "All Lab Results", {totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), labResults: result}, false);
            })
            .catch(err => {
                return makeResponse(res, 400, err.message, null, true);
            })
    }
};

const updateLabRequest = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const { labRequest } = req.params;

    const filter = { _id: labRequest };
    let update = {tests: req.body, status: "completed"};

    LaboratoryRequest.findOneAndUpdate(filter, update).then(updatedRequest => {
        return makeResponse(res, 200, "Lab Request updated Successfully", updatedRequest, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

export default { 
    createLabRequest,
    getLabRequests,
    updateLabRequest
};
