import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Services from '../../models/hospital/services';
import makeResponse from '../../functions/makeResponse';

const NAMESPACE = "Services";

const createService = (req: Request, res: Response, next: NextFunction) => {
     const { name } = req.body;

     const newServices = new Services({ name });
     newServices.save().then(result => {
        return makeResponse(res, 201, "Services Created Successfully", result, false);
     })
     .catch(err => {
        return makeResponse(res, 400, err.message, null, true);
     });
};

const getAllServices = (req: Request, res: Response, next: NextFunction) => {
    Services.find({})
        .then(result => {
            return makeResponse(res, 200, "All Servicess", result, false);
        })
        .catch(err => {
            console.log("Result => ", err);
            return makeResponse(res, 400, err.message, null, true);
        })
};

const getSingleService = (req: Request, res: Response, next: NextFunction) => {
    Services.findById({ _id: req.params.id })
    .then(data => {
        return makeResponse(res, 200, "Services", data, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    })
};

const updateService = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const filter = { _id: id };
    let update = {...req.body};

    Services.findOneAndUpdate(filter, update).then(updatedServices => {
        return makeResponse(res, 200, "Services updated Successfully", updatedServices, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

const deleteService = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    try {
        const services = await Services.findByIdAndDelete(_id);
    if (!services) return res.sendStatus(404);
        return makeResponse(res, 200, "Deleted Successfully", Services, false);
    } catch (e) {
        return res.sendStatus(400);
    }
};

export default { 
    createService, 
    getAllServices,
    getSingleService,
    updateService,
    deleteService
};
