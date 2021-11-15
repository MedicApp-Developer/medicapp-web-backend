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
import { Pagination } from '../../constants/pagination';
import Doctor from '../../models/doctors/doctor';

const NAMESPACE = "Labortory";

const createLabortory = async (req: Request, res: Response, next: NextFunction) => {
        const { email, firstName, lastName, mobile } = req.body;

        const password = getRandomPassword();

        await User.find({email}).then(result => {
            if(result.length === 0){
                if(email && password && firstName && lastName && mobile){
                            const newLabortory = new Labortory({
                                _id: new mongoose.Types.ObjectId(),
                                email, firstName, lastName, mobile, hospitalId: res.locals.jwt.reference_id
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
                                    await UserController.createUserFromEmailAndPassword(req, res, email, password, firstName, lastName, "", Roles.LABORTORY, result._id)
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

const getAllLabortories = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const page = parseInt(req.query.page || "0");

    if(req.query.getAll){
        // @ts-ignore
        Labortory.find({ hospitalId: req.query.hospitalId })
        .then(result => {
            return makeResponse(res, 200, "All Labortories", {labs: result}, false);
        })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true);
        })    
    }else {
        const total = await Labortory.find({ hospitalId: res.locals.jwt.reference_id }).countDocuments({});

        Labortory.find({ hospitalId: res.locals.jwt.reference_id }).limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page)
            .then(result => {
                return makeResponse(res, 200, "All Labortories", {totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), labs: result}, false);
            })
            .catch(err => {
                return makeResponse(res, 400, err.message, null, true);
            })
    }
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
    const { _id } = res.locals.jwt;
    
    // This id is updated hospital itself id 
    const { id } = req.params;

    const update = JSON.parse(JSON.stringify({...req.body}));

    update.password && delete update.password;

    const filter = { _id: id };

    UserController.updateUser(req, res, _id, req.body);
    
    Labortory.findOneAndUpdate(filter, update).then(updatedLab => {
        return makeResponse(res, 200, "Laboratory updated Successfully", updatedLab, false);
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
        return makeResponse(res, 200, "Deleted Successfully", labortory, false);
    } catch (e) {
        return res.sendStatus(400);
    }
};

const searchLabortory = async (req: Request, res: Response, next: NextFunction) => {
    const { searchedText } = req.params;
    // @ts-ignore
    const page = parseInt(req.query.page || "0");

    // Regex
    const searchedTextRegex = new RegExp(searchedText, 'i');

    const searchQuery = [
        { firstName: searchedTextRegex },
        { lastName: searchedTextRegex },
        { email: searchedTextRegex },
        { mobile: searchedTextRegex }
    ]

    const total = await Labortory.find({$and: [{$or: searchQuery}, {hospitalId :  res.locals.jwt.reference_id }]}).countDocuments({});

    Labortory.find({$and: [{$or: searchQuery}, {hospitalId:  res.locals.jwt.reference_id }]}).limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page)
        .then(result => {
            return makeResponse(res, 200, "Search Results", {searchedText, totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), labs: result}, false);
        }).catch(err => {
        return makeResponse(res, 400, "No labs found", null, true);
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
