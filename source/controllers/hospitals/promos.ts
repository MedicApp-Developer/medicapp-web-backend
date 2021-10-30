import { NextFunction, Request, Response } from 'express';
import Promos from '../../models/hospital/promo';
import makeResponse from '../../functions/makeResponse';
import { Pagination } from '../../constants/pagination';
import { uploadsOnlyVideo } from '../../functions/uploadS3';

const NAMESPACE = "Promos";

const createPromo = (req: Request, res: Response, next: NextFunction) => {
    console.log("Uploading File...");
    uploadsOnlyVideo(req, res, async (error: any) => {
        if (error) {
          res.json({ error: error });
          return makeResponse(res, 400, "Error in uploading image", null, true);
        } else {
          // If File not found
          // console.log("Ressss => ", req.files);
          if (req.file === undefined) {
            return makeResponse(res, 400, "No File Selected", null, true);
          } else {

            console.log("file => ", req.file);
            
            const newPromo = new Promos({
              // @ts-ignore
              url: req.file.location,
              // @ts-ignore
              name: req.file.originalname,
              // @ts-ignore
              key: req.file.key,
              hospitalId: res.locals.jwt.reference_id
            });

           await newPromo.save()
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
          }
        }
      });
};

const getAllPromos = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const page = parseInt(req.query.page || "0");

    const total = await Promos.find({ hospitalId: res.locals.jwt.reference_id }).countDocuments({});

    Promos.find({ hospitalId: res.locals.jwt.reference_id }).limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page)
        .then((result: any) => {
            return makeResponse(res, 200, "All Promo Videos", {totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), videos: result}, false);
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
    deletePromo
};
