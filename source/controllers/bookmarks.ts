import { NextFunction, Request, Response } from 'express';
import makeResponse, { sendErrorResponse } from '../functions/makeResponse';
import Bookmark from '../models/bookmark';
import { Roles } from '../constants/roles';
import { SERVER_ERROR_CODE } from '../constants/statusCode';
import Hospital from '../models/hospital/hospital';
import Doctor from '../models/doctors/doctor';

const createBookmark = async (req: Request, res: Response, next: NextFunction) => {
    const { type, id } = req.body;
    const bookmarks = await Bookmark.find({ user: res.locals.jwt._id });
    if (bookmarks) {
        const update = type === Roles.DOCTOR ? { doctorIds: id } : { hospitalIds: id };
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

const deleteBookmark = async (req: Request, res: Response, next: NextFunction) => {
    const { type, id } = req.body;
    const update = type === Roles.DOCTOR ? { doctorIds: id } : { hospitalIds: id };
    
    Bookmark.findOneAndUpdate(
        { user: res.locals.jwt._id },
        { $pull: update },
        { upsert: true }
    ).then(result => {
        return makeResponse(res, 201, "Bookmark Deleted Successfully", result, false);
    }).catch(err => {
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
    });
};

const getBookmarks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookmarks = await Bookmark.find({ user: res.locals.jwt._id });
        let hospitals: any = [];
        let doctors: any = [];

        if (bookmarks?.length > 0 && bookmarks[0]?.hospitalIds.length > 0) {
            hospitals = await Hospital.find({
                '_id': { $in: bookmarks[0].hospitalIds }
            }).populate('insurances');
        }

        if (bookmarks?.length > 0 && bookmarks[0]?.doctorIds.length > 0) {
            doctors = await Doctor.find({
                '_id': { $in: bookmarks[0].doctorIds }
            }).populate("specialityId").populate({ path: 'hospitalId', populate: [{ path: 'insurances' }] })
        }

        return makeResponse(res, 201, "All Bookmarks", { hospitals, doctors }, false);

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
    }
};

export default {
    createBookmark,
    deleteBookmark,
    getBookmarks
};
