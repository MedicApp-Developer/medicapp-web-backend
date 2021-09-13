import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Branch from '../../models/pharmacy/branch';
import User from '../../models/user';
import makeResponse from '../../functions/makeResponse';
import UserController from '../user';
import { Roles } from '../../constants/roles';
import config from '../../config/config';

const NAMESPACE = "Branch";

const createBranch = async (req: Request, res: Response, next: NextFunction) => {
    const { location, mobile, about, pharmacyId } = req.body;
    
        if(location && mobile && about && pharmacyId){
            const newBranch = new Branch({
                    _id: new mongoose.Types.ObjectId(),
                    location, mobile, about, pharmacyId
                });
                
                return newBranch.save()
                    .then(result => {
                        return makeResponse(res, 201, "Branch Created Successfully", result, false);
                    })
                    .catch(err => {
                        return makeResponse(res, 400, err.message, null, true);
                    });
        }else {
            return makeResponse(res, 400, "Validation Failed", null, true);
        }
    
};

const getAllBranchesOfPharmacy = (req: Request, res: Response, next: NextFunction) => {
    Branch.find({pharmacyId: req.params.pharmacyId})
        .then(result => {
            return makeResponse(res, 200, "All Branches", result, false);
        })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true);
        })
};

const getSingleBranch = (req: Request, res: Response, next: NextFunction) => {
    Branch.findById({ _id: req.params.branchId })
    .then(data => {
        return makeResponse(res, 200, "Branch", data, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    })
};

const updateBranch = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const filter = { _id: id };
    let update = {...req.body};

    Branch.findOneAndUpdate(filter, update).then(updatedBranch => {
        return makeResponse(res, 200, "Branch updated Successfully", updatedBranch, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

const deleteBranch = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    try {
        const branch = await Branch.findByIdAndDelete(_id);
        if (!branch) return res.sendStatus(404);
        return makeResponse(res, 200, "Deleted Successfully", branch, false);
    } catch (e) {
        return res.sendStatus(400);
    }
};

const searchBranch = async (req: Request, res: Response, next: NextFunction) => {
    const { searchedText } = req.params;

    // Regex 
    const searchedTextRegex = new RegExp(searchedText, 'i');

    const searchQuery = [
        { mobile: searchedTextRegex }, 
        { location: searchedTextRegex },
        { about: searchedTextRegex } 
    ]

    Branch.find({$or: searchQuery}).then(result => {
        return makeResponse(res, 200, "Search Results", result, false);
    }).catch(err => {
        return makeResponse(res, 400, "Error while searching Branch", null, true);
    });

};

export default { 
    createBranch, 
    getAllBranchesOfPharmacy,
    getSingleBranch,
    updateBranch,
    deleteBranch,
    searchBranch
};
