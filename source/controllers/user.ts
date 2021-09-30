import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/user';
import signJWT from '../functions/signJWT';
import makeResponse from '../functions/makeResponse';
import validateRegisterInput from "../validation/register";
import validateLoginInput from '../validation/login';

const NAMESPACE = "User";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Token validated, user authenticated");
    return res.status(200).json({
        message: "Authorized"
    });
};

const register = (req: Request, res: Response, next: NextFunction) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return makeResponse(res, 400, "Validation Failed", errors, true);
    }
    
    let { email, password } = req.body;

    User.find({ email }).exec().then(user => {
        if(user.length > 0){
            return makeResponse(res, 400, "Email already exists", null, true);
        }

        // If email is valid
        bcryptjs.hash(password, 10, (hashError, hash) => {
            if(hashError){
                return makeResponse(res, 400, hashError.message, null, true);
            }

            const _user = new User({
                _id: new mongoose.Types.ObjectId(),
                email,
                password: hash
            });

            return _user.save().then(user => {
                return makeResponse(res, 201, "User Registered Successfully", user, false);

            }).catch(error => {
                return makeResponse(res, 400, error.message, null, true);
            });
        });
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {

    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return makeResponse(res, 400, "Validation Failed", errors, true);
    }

    let { email, password } = req.body;

    User.find({ email })
        .exec()
        .then(users => {
            if(users.length !== 1){
                return makeResponse(res, 400, "Unauthorized", null, true);
            }

            bcryptjs.compare(password, users[0].password, (error, result) => {
                if(!result){
                    return makeResponse(res, 400, "Unauthorized", null, true);
                }else if(result){
                    signJWT(users[0], (_error, token) => {
                        if(_error){
                            logging.error(NAMESPACE, 'Unable to sign token: ', _error);
                            
                            return makeResponse(res, 400, "Unauthorized", null, true);

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

const createUserFromEmailAndPassword = async (req: Request, res: Response, email: string, password: string, name: string, role: string, referenceId: string) => {
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
                name,
                email,
                password: hash,
                role,
                referenceId
            });

            return await _user.save();
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
    deleteUserWithEmail,
    updateUser
};
