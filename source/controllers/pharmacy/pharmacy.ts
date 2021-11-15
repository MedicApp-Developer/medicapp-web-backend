import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Pharmacy from '../../models/pharmacy/pharmacy';
import User from '../../models/user';
import makeResponse from '../../functions/makeResponse';
import UserController from '../user';
import { Roles } from '../../constants/roles';
import config from '../../config/config';

const NAMESPACE = "Hospital";
 
const createPharmacy = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name, tradeLicenseNo, issueDate, expiryDate, noOfBranches } = req.body;
    
    await User.find({ email }).then(result => {
        if(result.length === 0){
            if(req && req.file && req.file.filename && email && password && name && tradeLicenseNo && issueDate && expiryDate && noOfBranches ){
                const newPharmacy = new Pharmacy({
                    _id: new mongoose.Types.ObjectId(),
                    email, name, tradeLicenseNo, issueDate, expiryDate, noOfBranches,
                    tradeLicenseFile: config.server.APP_URL + "/" + (( req && req.file && req.file.filename ) ? req.file.filename : "")
                });
                
                return newPharmacy.save()
                    .then(async result => {
                        await UserController.createUserFromEmailAndPassword(req, res, email, password, name, "", "", Roles.PHARMACY, result._id)
                        return makeResponse(res, 201, "Pharmacy Created Successfully", result, false);

                        // if(){
                        //     return makeResponse(res, 201, "Pharmacy Created Successfully", result, false);
                        // }else {
                        //     return makeResponse(res, 201, "Something went wrong while creating Pharmacy", result, false);
                        // };
                    })
                    .catch(err => {
                        return makeResponse(res, 400, err.message, null, true);
                    });
            }else {
                return makeResponse(res, 400, "Validation Failed", null, true);
            }
        }else {
            return makeResponse(res, 400, "Email already exists", null, true);
        }
    }); 
};

const getAllPharmacies = (req: Request, res: Response, next: NextFunction) => {
    Pharmacy.find({})
        .then(result => {
            return makeResponse(res, 200, "All Pharmacies", result, false);
        })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true);
        })
};

const getSinglePharmacy = (req: Request, res: Response, next: NextFunction) => {
    Pharmacy.findById({ _id: req.params.id })
    .then(data => {
        return makeResponse(res, 200, "Pharmacy", data, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    })
};

const updatePharmacy = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const filter = { _id: id };
    let update = {...req.body};

    Pharmacy.findOneAndUpdate(filter, update).then(updatedPharmacy => {
        return makeResponse(res, 200, "Pharmacy updated Successfully", updatedPharmacy, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

const deletePharmacy = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    try {
        const pharmacy = await Pharmacy.findByIdAndDelete(_id);
    if (!pharmacy) return res.sendStatus(404);
        await UserController.deleteUserWithEmail(pharmacy.email)
        return makeResponse(res, 200, "Deleted Successfully", pharmacy, false);
        
        // if(){
        //     return makeResponse(res, 200, "Deleted Successfully", pharmacy, false);
        // }else {
        //     return makeResponse(res, 400, "Error while deleting Pharmacy", null, true);
        // }
    } catch (e) {
        return res.sendStatus(400);
    }
};

const searchPharmacy = async (req: Request, res: Response, next: NextFunction) => {
    const { searchedText } = req.params;

    // Regex 
    const searchedTextRegex = new RegExp(searchedText, 'i');

    const searchQuery = [
        { name: searchedTextRegex }, 
        { email: searchedTextRegex },
        { tradeLicenseNo: searchedTextRegex } 
    ]

    Pharmacy.find({$or: searchQuery}).then(result => {
        return makeResponse(res, 200, "Search Results", result, false);
    }).catch(err => {
        return makeResponse(res, 400, "Error while searching Pharmacy", null, true);
    });

};

export default { 
    createPharmacy, 
    getAllPharmacies,
    getSinglePharmacy,
    updatePharmacy,
    deletePharmacy,
    searchPharmacy
};
