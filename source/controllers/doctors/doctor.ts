import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Doctor from '../../models/doctors/doctor';
import User from '../../models/user';
import makeResponse from '../../functions/makeResponse';
import UserController from '../user';
import { Roles } from '../../constants/roles';
import { sendEmail } from '../../functions/mailer';
import { getRandomPassword } from '../../functions/utilities';
import config from '../../config/config';

const NAMESPACE = "Doctor";

const createDoctor = async (req: Request, res: Response, next: NextFunction) => {
        const { email, firstName, lastName, mobile } = req.body;
        const password = getRandomPassword();

        await User.find({email}).then(result => {
            if(result.length === 0){
                if(email && firstName && lastName && mobile){
                    const newDoctor = new Doctor({
                        _id: new mongoose.Types.ObjectId(),
                        email, password, firstName, lastName, mobile, hospitalId: res.locals.jwt._id
                    }); 

                    const options = {
                        from: config.mailer.user,
                        to: email,
                        subject: "Welcome to Medicapp",
                        text: `Your account account has been created as a doctor, and your password is ${password}`
                    }

                    sendEmail(options);
                    
                    return newDoctor.save()
                        .then(async result => {
                            await UserController.createUserFromEmailAndPassword(req, res, email, password, firstName + " " + lastName, Roles.DOCTOR, result._id)
                            return makeResponse(res, 201, "Doctor Created Successfully", result, false);
                            
                            // TODO: Need to be fixed
                            
                            // if(){
                            //     return makeResponse(res, 201, "Doctor Created Successfully", result, false);
                            // }else {
                            //     return makeResponse(res, 201, "Something went wrong while creating Doctor", result, false);
                            // };
                        })
                        .catch(err => {
                            return makeResponse(res, 400, err.message, null, true);
                        });
                }else {
                    return makeResponse(res, 400, "Validation Failed", null, true);
                }
            }else {
                return makeResponse(res, 400, "Email Already in use", null, true);
            }
        })
};

const getAllDoctors = (req: Request, res: Response, next: NextFunction) => {
    Doctor.find({ hospitalId: res.locals.jwt._id })
        .then(result => {
            return makeResponse(res, 200, "All Doctors", result, false);
        })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true);
        })
};

const getSingleDoctor = (req: Request, res: Response, next: NextFunction) => {
    Doctor.findById({ _id: req.params.id })
    .then(data => {
        return makeResponse(res, 200, "Doctor", data, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    })
};

const updateDoctor = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const filter = { _id: id };
    let update = {...req.body};

    Doctor.findOneAndUpdate(filter, update).then(updatedDoctor => {
        return makeResponse(res, 200, "Doctor updated Successfully", updatedDoctor, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

const deleteDoctor = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    try {
        const doctor = await Doctor.findByIdAndDelete(_id);
    if (!doctor) return res.sendStatus(404);
        await UserController.deleteUserWithEmail(doctor.email);
        return makeResponse(res, 200, "Deleted Successfully", doctor, false);
        
        // if(){
        //     return makeResponse(res, 200, "Deleted Successfully", doctor, false);
        // }else {
        //     return makeResponse(res, 400, "Error while deleting Doctor", null, true);
        // }
    } catch (e) {
        return res.sendStatus(400);
    }
};

const searchDoctor = async (req: Request, res: Response, next: NextFunction) => {
    const { searchedText } = req.params;

    // Regex 
    const searchedTextRegex = new RegExp(searchedText, 'i');

    const searchQuery = [
        { firstName: searchedTextRegex }, 
        { lastName: searchedTextRegex },
        { email: searchedTextRegex },
        { mobile: searchedTextRegex } 
    ]

    Doctor.find({$or: searchQuery}).then(result => {
        return makeResponse(res, 200, "Search Results", result, false);
    }).catch(err => {
        return makeResponse(res, 400, "Error while searching Doctor", null, true);
    });

};

export default { 
    createDoctor, 
    getAllDoctors,
    getSingleDoctor,
    updateDoctor,
    deleteDoctor,
    searchDoctor
};
