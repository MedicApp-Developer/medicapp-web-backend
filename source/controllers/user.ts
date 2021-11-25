import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/user';
import signJWT from '../functions/signJWT';
import makeResponse, { sendErrorResponse } from '../functions/makeResponse';
import validateLoginInput from '../validation/login';
import { PARAMETER_MISSING_CODE, UNAUTHORIZED_CODE, INVALID_VALUE_CODE, DUPLICATE_VALUE_CODE } from '../constants/statusCode';
import { Roles } from '../constants/roles';
import Patient from '../models/patient';

const NAMESPACE = "User";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Token validated, user authenticated");
    return res.status(200).json({
        message: "Authorized"
    });
};

const register = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password } = req.body;

    if(!firstName || !lastName || !email || !password){
        return sendErrorResponse(res, 400, "Parameter missing", PARAMETER_MISSING_CODE);
    }

    await User.find({ email }).exec().then(user => {
        if(user.length > 0){
            return sendErrorResponse(res, 400, "User with this email already exists", DUPLICATE_VALUE_CODE);
        }

        // If email is valid
        bcryptjs.hash(password, 10, async (hashError, hash) => {
            if(hashError){
                return false;
            }

            const _user = new User({
                _id: new mongoose.Types.ObjectId(),
                firstName,
                lastName,
                email,
                password: hash,
                role: Roles.ADMIN,
                emiratesId: "",
                referenceId: null
            });

            _user.save().then(user => {
                return makeResponse(res, 200, "Authentication Successful", {user: user}, false);
            }).catch(err => console.log(err));
        });
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {

    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        // @ts-ignore
        return sendErrorResponse(res, 400, Object.values(errors)[0] , Object.values(errors)[0].includes("invalid") ? INVALID_VALUE_CODE : PARAMETER_MISSING_CODE);
    }

    let { email, password } = req.body;

    User.find({ email })
        .exec()
        .then(async users => {
            if(users.length !== 1){
                return sendErrorResponse(res, 400, "Unauthorized", UNAUTHORIZED_CODE);
            }

            bcryptjs.compare(password, users[0].password, (error, result) => {
                if(!result){
                    return sendErrorResponse(res, 400, "Unauthorized", UNAUTHORIZED_CODE);
                }else if(result){
                    signJWT(users[0], (_error, token) => {
                        if(_error){
                            logging.error(NAMESPACE, 'Unable to sign token: ', _error);
                            return sendErrorResponse(res, 400, "Unauthorized", UNAUTHORIZED_CODE);
                        }else if(token){ 
                            return makeResponse(res, 200, "Authentication Successful", {user: users[0], token: token}, false);
                        }
                    })
                }
            })
        }).catch(error => {
            return makeResponse(res, 400, error.message, null, true);
        })
};

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
 User.find().select("-password").exec()
    .then(users => {
        return makeResponse(res, 200, "Users List", users, false);
    })
    .catch(error => {
        return makeResponse(res, 400, error.message, null, true);
    })
};

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    User.deleteOne({ _id: req.params.id }).then(user => {
        return makeResponse(res, 200, "User Deleted Successfully", null, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

const createUserFromEmailAndPassword = async (req: Request, res: Response, email: string, password: string, firstName: string, lastName: string, emiratesId: string, role: string, referenceId: string) => {
    await User.find({ email }).exec().then(user => {
        if(user.length > 0){
            return false;
        }

        // If email is valid
        bcryptjs.hash(password, 10, async (hashError, hash) => {
            if(hashError){
                return false;
            }

            const _user = new User({
                _id: new mongoose.Types.ObjectId(),
                firstName,
                lastName,
                email,
                password: hash,
                role,
                emiratesId,
                referenceId
            });

            return _user.save();
        });
    });
}

const createPatientUserFromEmailAndPassword = async (req: Request, res: Response, email: string, password: string, firstName: string, lastName: string, phoneNo: string, emiratesId: string, role: string, referenceId: string) => {
    await User.find({ email }).exec().then(user => {
        if(user.length > 0){
            return false;
        }

        // If email is valid
        bcryptjs.hash(password, 10, async (hashError, hash) => {
            if(hashError){
                return false;
            }

            const _user = new User({
                _id: new mongoose.Types.ObjectId(),
                firstName,
                lastName,
                email,
                phoneNo,
                password: hash,
                role,
                emiratesId,
                referenceId
            });

            _user.save().then(createdUser => {
                // @ts-ignore
                signJWT(createdUser, (_error, token) => {
                    if(_error){
                        logging.error(NAMESPACE, 'Unable to sign token: ', _error);
                        return sendErrorResponse(res, 400, "Unauthorized", UNAUTHORIZED_CODE);
                    }else if(token){
                        return makeResponse(res, 200, "Patient registered successfully", {user: createdUser, token: token}, false);
                    }
                })            
            });
        });
    });
}
    
const deleteUserWithEmail = async (email: string) => {
     User.deleteOne({ email }).then(user => {
        return true;
    }).catch(err => {
        return false;
    });
}

const updateUser = async (req: Request, res: Response, id: string, user: any) => {
    
    let update = {...req.body};

    if(req.body.password) {
        const hash = await bcryptjs.hash(user.password, 10);
        update = { ...update, password: hash }
    }else {
        delete update.password;
    }

    User.findOneAndUpdate({_id: id}, { ...update }).then(updatedHospital => {
        return true;
    }).catch(err => {
        return false;
    });
}

export default { 
    validateToken, 
    login, 
    register, 
    getAllUsers,
    deleteUser,
    createUserFromEmailAndPassword,
    createPatientUserFromEmailAndPassword,
    deleteUserWithEmail,
    updateUser
};
