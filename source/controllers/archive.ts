import { NextFunction, Request, Response } from 'express';
import config from '../config/config';
import cloudinary from 'cloudinary'
import Archive from '../models/archive';
import mongoose from 'mongoose'
import makeResponse, { sendErrorResponse } from '../functions/makeResponse';
import { PARAMETER_MISSING_CODE, SERVER_ERROR_CODE } from '../constants/statusCode';

const createArchive = async (req: Request, res: Response, next: NextFunction) => {
  
  try {

    // @ts-ignore
    cloudinary.v2.config({
        cloud_name: config.cloudinary.name,
        api_key: config.cloudinary.apiKey,
        api_secret: config.cloudinary.secretKey
    })

    // @ts-ignore
    const result = await cloudinary.uploader.upload(req.file.path)

    const { from, to, url, pageNumber, hospitalId } = req.body;

    if (!from || !to || !pageNumber) {
      return sendErrorResponse(res, 400, "Parameter validation failed", PARAMETER_MISSING_CODE)
    }


    const newArchive = new Archive({
      _id: new mongoose.Types.ObjectId(), url: result.url, from, to, pageNumber, hospitalId
    });

    newArchive.save().then(result => {
      return makeResponse(res, 200, 'Expense', result, false);
    });

  } catch (err) { 
    // @ts-ignore
    return sendErrorResponse(res, 400, err, PARAMETER_MISSING_CODE)
  }

};

const deleteArchive = async (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.id
  try {
    const archive = await Archive.findByIdAndDelete(_id)
    if (!archive) return res.sendStatus(404)
    return makeResponse(res, 200, "Deleted Successfully", archive, false)
  } catch (err) { 
    // @ts-ignore
    return sendErrorResponse(res, 400, err, SERVER_ERROR_CODE)
  }
};

const getArchives = async (req: Request, res: Response, next: NextFunction) => {
  Archive.find({}).populate('hospitalId').then(result => {
    return makeResponse(res, 200, "Deleted Successfully", result, false)
  }).catch(err => { 
    return sendErrorResponse(res, 400, err, SERVER_ERROR_CODE)
  });
};

const filterFromToArchived = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const { fromDate, toDate } = req.body;

      const archives = await Archive.find({
          // @ts-ignore
          date: {
              $gte: new Date(new Date(fromDate).setHours(0o0, 0o0, 0o0)),
              $lt: new Date(new Date(toDate).setHours(23, 59, 59))
          }
      }).populate("hospitalId");

      return makeResponse(res, 200, "Hospital Finance Statistics", archives, false)

  } catch (err) {
      // @ts-ignore
      return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
  }
}

const searchArchiveByPageNumber = async (req: Request, res: Response, next: NextFunction) => {
  const { searchedText } = req.params;

  try {
    const result = await Archive.find({ pageNumber: parseInt(searchedText) });
    return makeResponse(res, 200, "Searched archived result by page number", result, false);
  } catch (err) { 
    return sendErrorResponse(res, 400, "Error while searching archive by page number", SERVER_ERROR_CODE)
  }

}

export default {
    createArchive,
    deleteArchive,
    getArchives,
    filterFromToArchived,
    searchArchiveByPageNumber
};
