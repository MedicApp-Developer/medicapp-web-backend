import { NextFunction, Request, Response } from 'express';
import { Pagination } from '../../constants/pagination';
import { Roles } from '../../constants/roles';
import makeResponse from '../../functions/makeResponse';
import config from '../../config/config'
import cloudinary from 'cloudinary'
import LaboratoryRequest from '../../models/labortories/labRequest';
import { test } from '../../templates';

const NAMESPACE = "Labortory Request";

const createLabRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { slotId, doctorId, patientId, laboratoryId, tests } = req.body;

    const newlabRequest = new LaboratoryRequest(
        { slotId, doctorId, patientId, laboratoryId, tests }
    );

    return newlabRequest.save()
        .then(result => {
            return makeResponse(res, 201, "Lab Request Created Successfully", result, false);
        })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true);
        });
};

const getLabRequests = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const page = parseInt(req.query.page || "0");
    const status = req.query.status;
    const { role } = res.locals.jwt;

    if (role === Roles.LABORTORY) {
        // @ts-ignore
        const total = await LaboratoryRequest.find({ laboratoryId: res.locals.jwt.reference_id, status }).countDocuments({});

        // @ts-ignore
        LaboratoryRequest.find({ laboratoryId: res.locals.jwt.reference_id, status }).limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page).populate('patientId').populate('doctorId')
            .then(result => {
                return makeResponse(res, 200, "All Lab Results", { totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), labResults: result }, false);
            })
            .catch(err => {
                return makeResponse(res, 400, err.message, null, true);
            })
    } else {
        // @ts-ignore
        const total = await LaboratoryRequest.find({ doctorId: res.locals.jwt.reference_id, status }).countDocuments({});

        // @ts-ignore
        LaboratoryRequest.find({ doctorId: res.locals.jwt.reference_id, status }).limit(Pagination.PAGE_SIZE).skip(Pagination.PAGE_SIZE * page).populate('patientId').populate('doctorId')
            .then(result => {
                return makeResponse(res, 200, "All Lab Results", { totalItems: total, totalPages: Math.ceil(total / Pagination.PAGE_SIZE), labResults: result }, false);
            })
            .catch(err => {
                return makeResponse(res, 400, err.message, null, true);
            })
    }
};

const updateLabRequest = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    //console.log(JSON.parse(req.body.data));
    //console.log(req.body.id);
    // console.log(req.files);

    // @ts-ignore
    cloudinary.v2.config({
        cloud_name: config.cloudinary.name,
        api_key: config.cloudinary.apiKey,
        api_secret: config.cloudinary.secretKey
    })

    // @ts-ignore

    const tests = JSON.parse(req.body.data)


    if (req.files !== undefined) {

        for (var i = 0; i < tests.length; i++) {
            if (tests[i].file !== undefined) {
                const files = req.files! as Array<Express.Multer.File>
                const foundedFile = files.find((foundFile => { return tests[i].file.includes(foundFile.originalname) }))
                if (foundedFile !== undefined) {
                    const result = await cloudinary.v2.uploader.upload(foundedFile.path)
                    tests[i].file = result.url;
                }
            }
        }
    }
    const filter = { _id: req.body.id };
    let update = { tests: tests, status: "completed" };

    LaboratoryRequest.findOneAndUpdate(filter, update).then(updatedRequest => {
        return makeResponse(res, 200, "Lab Request updated Successfully", updatedRequest, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });

};

export default {
    createLabRequest,
    getLabRequests,
    updateLabRequest
};
