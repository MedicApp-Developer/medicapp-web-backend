import { NextFunction, Request, Response } from 'express';
import Promos from '../../models/hospital/promo';
import makeResponse from '../../functions/makeResponse';
import { Pagination } from '../../constants/pagination';
import { uploadsOnlyVideo } from '../../functions/uploadS3';
import config from '../../config/config'
import cloudinary from 'cloudinary'

const NAMESPACE = "Promos";

const createPromo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    cloudinary.v2.config({
      cloud_name: config.cloudinary.name,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.secretKey
    })

    // @ts-ignore
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      resource_type: "video",
      public_id: "sample_id",
      chunk_size: 6000000,
      eager: [
        { width: 300, height: 300, crop: "pad", audio_codec: "none" },
        { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }],
      eager_async: true,
    })


    const newPromo = new Promos({
      // @ts-ignore
      url: result.url,
      // @ts-ignore
      name: req.file.originalname,
      hospitalId: res.locals.jwt.reference_id
    });

    newPromo.save()
      .then((video: any) => {
        return makeResponse(res, 201, "Promo video uploaded successfully", video, false);
      })
      .catch((err: any) => {
        res.status(400).json({
          statusCode: 400,
          message: "Update Failed",
          errors: err,
        });
      });
  } catch (err) {
    res.status(400).json({
      statusCode: 400,
      message: "Update Failed",
      errors: err,
    });
  }
};

const getAllPromos = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const page = parseInt(req.query.page || "0");

  const total = await Promos.find({ hospitalId: res.locals.jwt.reference_id }).countDocuments({});

  Promos.find({ hospitalId: res.locals.jwt.reference_id }).limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page)
    .then((result: any) => {
      return makeResponse(res, 200, "All Promo Videos", { totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), videos: result }, false);
    })
    .catch((err: any) => {
      return makeResponse(res, 400, err.message, null, true);
    })
};

const getAllPromoVideos = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const page = parseInt(req.query.page || "0");

  const total = await Promos.find({}).countDocuments({});

  Promos.find({}).populate("hospitalId").limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page)
    .then((result: any) => {
      return makeResponse(res, 200, "All Promo Videos", { totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), videos: result }, false);
    })
    .catch((err: any) => {
      return makeResponse(res, 400, err.message, null, true);
    })
};

const deletePromo = async (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.id;
  try {
    const promos = await Promos.findByIdAndDelete(_id);
    if (!promos) return res.sendStatus(404);
    return makeResponse(res, 200, "Deleted Successfully", promos, false);
  } catch (e) {
    return res.sendStatus(400);
  }
};

export default {
  createPromo,
  getAllPromos,
  deletePromo,
  getAllPromoVideos
};
