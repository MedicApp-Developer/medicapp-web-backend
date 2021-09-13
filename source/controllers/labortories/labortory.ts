import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Labortory from '../../models/labortories/labortory';
import User from '../../models/user';
import makeResponse from '../../functions/makeResponse';
import UserController from '../user';
import { Roles } from '../../constants/roles';
import { getRandomPassword } from '../../functions/utilities';
import config from '../../config/config';
import { sendEmail } from '../../functions/mailer';

const NAMESPACE = "Labortory";

const createLabortory = async (req: Request, res: Response, next: NextFunction) => {
        const { email, firstName, lastName, mobile } = req.body;

        const password = getRandomPassword();

        await User.find({email}).then(result => {
            if(result.length === 0){
                if(email && password && firstName && lastName && mobile){
                            const newLabortory = new Labortory({
                                _id: new mongoose.Types.ObjectId(),
                                email, firstName, lastName, mobile, hospitalId: res.locals.jwt._id
                            }); 

                    const options = {
                        from: config.mailer.user,
                        to: email,
                        subject: "Welcome to Medicapp",
                        text: `Your account account has been created as a Labortory admin, and your password is ${password}`
                    }

                    sendEmail(options);

                            return newLabortory.save()
                                .then(async result => {
                                    await UserController.createUserFromEmailAndPassword(req, res, email, password, firstName + " " + lastName ,Roles.LABORTORY, result._id)
                                    return makeResponse(res, 201, "Labortory Created Successfully", result, false);
                                    
                                    // if(){
                                    //     return makeResponse(res, 201, "Labortory Created Successfully", result, false);
                                    // }else {
                                    //     return makeResponse(res, 201, "Something went wrong while creating Labortory", result, false);
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
        })
};

const getAllLabortories = (req: Request, res: Response, next: NextFunction) => {
    Labortory.find({ hospitalId: res.locals.jwt._id })
        .then(result => {
            return makeResponse(res, 200, "All Labortories", result, false);
        })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true);
        })
};

const getSingleLabortory = (req: Request, res: Response, next: NextFunction) => {
    Labortory.findById({ _id: req.params.id })
    .then(data => {
        return makeResponse(res, 200, "Labortory", data, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    })
};

const updateLabortory = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const filter = { _id: id };
    let update = {...req.body};

    Labortory.findOneAndUpdate(filter, update).then(updatedLabortory => {
        return makeResponse(res, 200, "Labortory updated Successfully", updatedLabortory, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

const deleteLabortory = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    try {
        const labortory = await Labortory.findByIdAndDelete(_id);
    if (!labortory) return res.sendStatus(404);
        await UserController.deleteUserWithEmail(labortory.email)
        // if(){
        //     return makeResponse(res, 200, "Deleted Successfully", labortory, false);
        // }else {
        //     return makeResponse(res, 400, "Error while deleting Labortory", null, true);
        // }
    } catch (e) {
        return res.sendStatus(400);
    }
};

const searchLabortory = async (req: Request, res: Response, next: NextFunction) => {
    const { searchedText } = req.params;

    // Regex 
    const searchedTextRegex = new RegExp(searchedText, 'i');

    const searchQuery = [
        { firstName: searchedTextRegex }, 
        { lastName: searchedTextRegex },
        { email: searchedTextRegex },
        { mobile: searchedTextRegex } 
    ]

    Labortory.find({$or: searchQuery}).then(result => {
        return makeResponse(res, 200, "Search Results", result, false);
    }).catch(err => {
        return makeResponse(res, 400, "Error while searching Labortory", null, true);
    });

};

export default { 
    createLabortory, 
    getAllLabortories,
    getSingleLabortory,
    updateLabortory,
    deleteLabortory,
    searchLabortory
};
