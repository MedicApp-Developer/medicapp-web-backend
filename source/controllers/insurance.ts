import { NextFunction, Request, Response } from 'express'
import makeResponse from '../functions/makeResponse'
import Insurance from '../models/insurance'
import { sendErrorResponse } from '../functions/makeResponse'
import { PARAMETER_MISSING_CODE, RECORD_NOT_FOUND, SERVER_ERROR_CODE, UNAUTHORIZED_CODE } from '../constants/statusCode'
import validateInsuranceInput from '../validation/insurance'
import cloudinary from 'cloudinary'
import config from '../config/config'

const NAMESPACE = "Insurance"

const createInsurance = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore

    

    cloudinary.v2.config({
        cloud_name: config.cloudinary.name,
        api_key: config.cloudinary.apiKey,
        api_secret: config.cloudinary.secretKey
    })

    if (req.file?.path) {
        // @ts-ignore
        const result = await cloudinary.uploader.upload(req.file?.path)
        // @ts-ignore
        const { errors, isValid } = validateInsuranceInput(req.body)
        // Check validation
        if (!isValid) {
            return makeResponse(res, 400, "Validation Failed", errors, true)
        }

        const { name_en, name_ar } = req.body

        // @ts-ignore
        const newInsurance = new Insurance({ name_en, name_ar, logo: result.url })
        newInsurance.save().then(insurance => {
            return makeResponse(res, 201, "Insurance Created Successfully", insurance, false)
        })
            .catch(err => {
                return sendErrorResponse(res, 400, "Unable to create insurance", SERVER_ERROR_CODE)
            })
    } else {
        return sendErrorResponse(res, 400, "Image not selected", SERVER_ERROR_CODE)
    }
}

const getAllInsurances = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (req.query.page !== undefined) {
        // @ts-ignore
        const page = parseInt(req.query.page || "0")
        const total = await Insurance.find({}).countDocuments({})

        Insurance.find({}).limit(6).skip(6 * page).then(insurances => {
            return makeResponse(res, 200, "All Insurances", { totalItems: total, totalPages: Math.ceil(total / 6), insurances }, false)
        })
            .catch(err => {
                return sendErrorResponse(res, 400, "No Record Found", RECORD_NOT_FOUND)
            })
    } else {
        Insurance.find({})
            .then(insurances => {
                return makeResponse(res, 200, "All Insurances", insurances, false)
            })
            .catch(err => {
                return sendErrorResponse(res, 400, "No Record Found", RECORD_NOT_FOUND)
            })
    }


}

const getSingleInsurance = (req: Request, res: Response, next: NextFunction) => {
    Insurance.findById({ _id: req.params.id })
        .then(data => {
            return makeResponse(res, 200, "Insurance", data, false)
        }).catch(err => {
            return sendErrorResponse(res, 400, "No Record Found", RECORD_NOT_FOUND)
        })
}

const updateInsurance = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    // @ts-ignore
    cloudinary.v2.config({
        cloud_name: config.cloudinary.name,
        api_key: config.cloudinary.apiKey,
        api_secret: config.cloudinary.secretKey
    })

    const filter = { _id: id }
    let update = {};
    // @ts-ignore
    if (req?.file?.path) {
        // @ts-ignore
        const result = await cloudinary.uploader.upload(req.file.path)
        update = { name_en: req.body.name_en, name_ar: req.body.name_ar, logo: result.url }
    } else {
        update = { name_en: req.body.name_en, name_ar: req.body.name_ar }
    }

    Insurance.findOneAndUpdate(filter, update).then(updatedInsurance => {
        return makeResponse(res, 200, "Insurance updated Successfully", updatedInsurance, false)
    }).catch(err => {
        return sendErrorResponse(res, 400, "Unable to update record", SERVER_ERROR_CODE)
    })
}

const deleteInsurance = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    try {
        const insurance = await Insurance.findByIdAndDelete(_id)
        if (!insurance) return res.sendStatus(404)
        return makeResponse(res, 200, "Deleted Successfully", insurance, false)
    } catch (e) {
        return sendErrorResponse(res, 400, "Unable to delete record", SERVER_ERROR_CODE)
    }
}

export default {
    createInsurance,
    getAllInsurances,
    getSingleInsurance,
    updateInsurance,
    deleteInsurance
}
