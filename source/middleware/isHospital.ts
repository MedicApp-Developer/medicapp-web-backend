import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { Roles } from '../constants/roles';
import makeResponse from '../functions/makeResponse';

const NAMESPACE = "IsHospital";

const isHospital = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Validating Token');

    let token = req.headers.authorization?.split(" ")[1];
    if (token) {
        // @ts-ignore
        jwt.verify(token, config.server.token.secret, (error, decoded: any) => {
            if (error) {
                return makeResponse(res, 404, error.message, error, true);
            } else if (decoded?.role === Roles.HOSPITAL) {
                res.locals.jwt = decoded;
                next();
            } else {
                return makeResponse(res, 404, "Only Hospital Admins can perform this task", null, true);
            }
        });
    } else {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}

export default isHospital;