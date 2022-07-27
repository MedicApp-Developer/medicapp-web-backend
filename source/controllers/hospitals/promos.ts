import { NextFunction, Request, Response } from 'express';
import Promos from '../../models/hospital/promo';
import makeResponse from '../../functions/makeResponse';
import { Pagination } from '../../constants/pagination';
import { uploadsOnlyVideo } from '../../functions/uploadS3';
import config from '../../config/config'
import cloudinary from 'cloudinary'
import Patient from '../../models/patient';

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
      chunk_size: 6000000,
      folder: `${res.locals.jwt.reference_id}/promo_videos`,
      eager_async: true,
    })

    console.log(result);

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

  // @ts-ignore
  const limit = parseInt(req.query.limit || "4")

  const total = await Promos.find({ hospitalId: res.locals.jwt.reference_id }).countDocuments({});

  Promos.find({ hospitalId: res.locals.jwt.reference_id }).limit(limit).skip(limit * page)
    .then((result: any) => {
      return makeResponse(res, 200, "All Promo Videos", { totalItems: total, totalPages: Math.ceil(total / limit), videos: result }, false);
    })
    .catch((err: any) => {
      return makeResponse(res, 400, err.message, null, true);
    })
};

const getAllPromoVideos = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const getAll = req.query.getAll;

  if (getAll) {
    Promos.find({})
      .populate({
        path: 'hospitalId',
        populate: [
          { path: 'category' },
          { path: 'services' },
          { path: 'insurances' }
        ]
      })
      .then((result: any) => {
        return makeResponse(res, 200, "All Promo Videos", { totalItems: 0, totalPages: 0, videos: result }, false);
      })
      .catch((err: any) => {
        return makeResponse(res, 400, err.message, null, true);
      })
  } else {
    // @ts-ignore
    const page = parseInt(req.query.page || "0");

    // @ts-ignore
    const limit = parseInt(req.query.limit || "4")

    const total = await Promos.find({}).countDocuments({});

    Promos.find({})
      .limit(limit).skip(limit * page)
      .populate({
        path: 'hospitalId',
        populate: [
          { path: 'category' },
          { path: 'services' },
          { path: 'insurances' }
        ]
      })
      .then((result: any) => {
        return makeResponse(res, 200, "All Promo Videos", { totalItems: total, totalPages: Math.ceil(total / limit), videos: result }, false);
      })
      .catch((err: any) => {
        return makeResponse(res, 400, err.message, null, true);
      })
  }
};

const deletePromo = async (req: Request, res: Response, next: NextFunction) => {
  const { id, videoId } = req.params;
  console.log(req.params);

  console.log(res.locals.jwt.reference_id);
  console.log(`${res.locals.jwt.reference_id}/promo_videos/${videoId}`);

  try {
    // @ts-ignore
    cloudinary.v2.config({
      cloud_name: config.cloudinary.name,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.secretKey
    })
    cloudinary.v2.uploader.destroy(`${res.locals.jwt.reference_id}/promo_videos/${videoId}`, { resource_type: "video" }, async (err, result) => {
      console.log(result);
      if (result.result === "ok") {
        const promos = await Promos.findByIdAndDelete(id);
        if (!promos) return res.sendStatus(404);
        return makeResponse(res, 200, "Deleted Successfully", promos, false);
      } else {
        return res.sendStatus(400)
      }
    })
  } catch (e) {
    return res.sendStatus(400);
  }
};

const likePromo = async (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.promoId;
  const patientId = req.params.patientId;

  try {
    // @ts-ignore
    const result = await Promos.findOneAndUpdate({ _id }, { $inc: { likes: +1 } }, { new: true })

    const filter = { _id: patientId }

    // @ts-ignore
    let update = { $push: { likedPromos: [_id] } }

    await Patient.findOneAndUpdate(filter, update);

    return makeResponse(res, 200, "Promo Liked Successfully", result, false);
  } catch (e) {
    return res.sendStatus(400);
  }
};

export default {
  createPromo,
  getAllPromos,
  deletePromo,
  getAllPromoVideos,
  likePromo
};
