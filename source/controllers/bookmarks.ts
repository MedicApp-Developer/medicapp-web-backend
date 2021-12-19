import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Appointment from '../models/appointment';
import makeResponse, { sendErrorResponse } from '../functions/makeResponse';
import { Pagination } from '../constants/pagination';
import Bookmark from '../models/bookmark';
import { Roles } from '../constants/roles';
import { SERVER_ERROR_CODE } from '../constants/statusCode';

const NAMESPACE = "Appointment";

const createBookmark = async (req: Request, res: Response, next: NextFunction) => {
    const { type, id } = req.body;
    const bookmarks = await Bookmark.find({ user: res.locals.jwt._id });
    if(bookmarks) {
        const update = type === Roles.DOCTOR ? {doctorIds: id} : {hospitalIds: id} ;
        console.log("Update => ", update);
        Bookmark.findOneAndUpdate(
            { user: res.locals.jwt._id },
            { $push: update },
            { upsert: true }
        ).then(result => {
            return makeResponse(res, 201, "Bookmark Saved Successfully", result, false);
        }).catch(err => {
            return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
        });
    } else {
        const bookmark = new Bookmark({
            user: res.locals.jwt._id,
            hospitalIds: type === Roles.HOSPITAL ? [id] : [],
            doctorIds: type === Roles.DOCTOR ? [id] : []
        });

        bookmark.save().then(result => {
            return makeResponse(res, 201, "Bookmark Saved Successfully", result, false);
        }).catch(err => {
            return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
        });
    }
};

export default { 
    createBookmark, 
};
