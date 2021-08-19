import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Role from '../models/role';
import makeResponse from '../functions/makeResponse';

const NAMESPACE = "Role";

const createRole = (req: Request, res: Response, next: NextFunction) => {
    const { name, code } = req.body;
    if(name && code){
        const newRole = new Role({
            _id: new mongoose.Types.ObjectId(),
            name, 
            code
        }); 

        return newRole.save()
            .then(result => {
                return makeResponse(res, 201, "Role Created Successfully", result, false);
            })
            .catch(err => {
                return makeResponse(res, 400, err.message, null, true);
            });
    }else {
        return makeResponse(res, 400, "Validation Failed", null, true);
    } 
};

const getAllRoles = (req: Request, res: Response, next: NextFunction) => {
    Role.find({})
        .then(result => {
            return makeResponse(res, 200, "All Roles", result, false);
        })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true);
        })
};

const getSingleRole = (req: Request, res: Response, next: NextFunction) => {
    Role.findById({ _id: req.params.id })
    .then(data => {
        return makeResponse(res, 200, "Role", data, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    })
};

const updateRole = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const filter = { _id: id };
    let update = {...req.body};

    Role.findOneAndUpdate(filter, update).then(updatedRole => {
        return makeResponse(res, 200, "Role updated Successfully", updatedRole, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

const deleteRole = (req: Request, res: Response, next: NextFunction) => {
    Role.deleteOne({ _id: req.params.id }).then(role => {
        return makeResponse(res, 200, "Role Deleted Successfully", role, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

export default { 
    createRole, 
    getAllRoles,
    getSingleRole,
    updateRole,
    deleteRole
};
