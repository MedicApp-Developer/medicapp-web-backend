import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Hospital from '../../models/hospital/hospital';
import User from '../../models/user';
import makeResponse from '../../functions/makeResponse';
import UserController from '../user';
import { Roles } from '../../constants/roles';
import { HospitalType } from '../../constants/hospital';
import config from '../../config/config';

const NAMESPACE = "Hospital";

const createHospital = async (req: Request, res: Response, next: NextFunction) => {
    const { email, phoneNo, password, name, tradeLicenseNo, issueDate, expiryDate, location } = req.body;
    
    await User.find({ email }).then(result => {
        if(result.length === 0){
            if(req && req.file && req.file.filename && email && phoneNo && password && name && tradeLicenseNo && issueDate && expiryDate && location ){
                const newHospital = new Hospital({
                    _id: new mongoose.Types.ObjectId(),
                    type: HospitalType.HOSPITAL, category: null, addons: [], phoneNo,
                    email, name, tradeLicenseNo, issueDate, expiryDate, location,
                    tradeLicenseFile: config.server.APP_URL + "/" + (( req && req.file && req.file.filename ) ? req.file.filename : "")
                });
                
                return newHospital.save()
                    .then(async result => {
                        await UserController.createUserFromEmailAndPassword(req, res, email, password, name, Roles.HOSPITAL, result._id);
                        return makeResponse(res, 201, "Hospital Created Successfully", result, false);
                        
                        // if(){
                        //     return makeResponse(res, 201, "Hospital Created Successfully", result, false);
                        // }else {
                        //     return makeResponse(res, 201, "Something went wrong while creating Hospital", result, false);
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

const getAllHospitals = (req: Request, res: Response, next: NextFunction) => {
    Hospital.find({})
        .then(result => {
            return makeResponse(res, 200, "All Hospitals", result, false);
        })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true);
        })
};

const getSingleHospital = (req: Request, res: Response, next: NextFunction) => {
    Hospital.findById({ _id: req.params.id })
    .then(data => {
        return makeResponse(res, 200, "Hospital", data, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    })
};

const updateHospital = (req: Request, res: Response, next: NextFunction) => {
    // This _id is Hospital User ID
    const { _id } = res.locals.jwt;

    // This id is updated hospital itself id 
    const { id } = req.params;

    const update = JSON.parse(JSON.stringify({...req.body}));

    update.password && delete update.password;

    const filter = { _id: id };

    UserController.updateUser(req, res, _id, req.body);
    
    Hospital.findOneAndUpdate(filter, update).then(updatedHospital => {
        return makeResponse(res, 200, "Hospital updated Successfully", updatedHospital, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

const deleteHospital = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    try {
        const hospital = await Hospital.findByIdAndDelete(_id);
    if (!hospital) return res.sendStatus(404);
        await UserController.deleteUserWithEmail(hospital.email);
        return makeResponse(res, 200, "Deleted Successfully", Hospital, false);
        
        // if(){
        //     return makeResponse(res, 200, "Deleted Successfully", Hospital, false);
        // }else {
        //     return makeResponse(res, 400, "Error while deleting Hospital", null, true);
        // }
    } catch (e) {
        return res.sendStatus(400);
    }
};

const searchHospital = async (req: Request, res: Response, next: NextFunction) => {
    const { searchedText } = req.params;

    // Regex 
    const searchedTextRegex = new RegExp(searchedText, 'i');

    const searchQuery = [
        { name: searchedTextRegex }, 
        { location: searchedTextRegex },
        { email: searchedTextRegex },
        { tradeLicenseNo: searchedTextRegex } 
    ]

    Hospital.find({$or: searchQuery}).then(result => {
        return makeResponse(res, 200, "Search Results", result, false);
    }).catch(err => {
        return makeResponse(res, 400, "Error while searching hospital", null, true);
    });

};

const uploadHospitalImages = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const filter = { _id: id };

    let update = { $push: { images: [config.server.APP_URL + "/" + (( req && req.file && req.file.filename ) ? req.file.filename : "")] } };

    Hospital.update(filter, update).then(updatedHospital => {
        return makeResponse(res, 200, "Hospital image uploaded Successfully", updatedHospital, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
}

export default { 
    createHospital, 
    getAllHospitals,
    getSingleHospital,
    updateHospital,
    deleteHospital,
    searchHospital,
    uploadHospitalImages
};
