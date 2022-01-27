import { NextFunction, Request, Response } from 'express'
import { Pagination } from '../../constants/pagination'
import { Roles } from '../../constants/roles'
import makeResponse from '../../functions/makeResponse'
import QrPrescription from '../../models/labortories/QrPrescription'
import pdf from 'html-pdf'
import generatePrescriptionSlip from '../../documents/Prescription'
import path from 'path'

const NAMESPACE = "QR Prescription"

const createQrPrescription = async (req: Request, res: Response, next: NextFunction) => {
    const { patientId, doctorId, data, date, treatmentType, prescription, dosageADay, consumptionDays } = req.body

    const qrPrescription = new QrPrescription(
        { patientId, doctorId, date, data, treatmentType, prescription, dosageADay, consumptionDays }
    )

    return qrPrescription.save()
        .then(result => {
            return makeResponse(res, 201, "QR Prescription Created Successfully", result, false)
        })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true)
        })
}

const getQrPrescription = async (req: Request, res: Response, next: NextFunction) => {
    QrPrescription.find({ patientId: res.locals.jwt.reference_id }).populate("doctorId").then(prescriptions => {
        return makeResponse(res, 201, "QR Prescription Created Successfully", prescriptions, false)
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true)
    })
}

const getQRPrescriptionSlip = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    try {
        const prescription = await QrPrescription.find({ _id: id })
            .populate('patientId')
            .populate({
                path: 'doctorId',
                populate: [
                    { path: 'specialityId' },
                    { path: 'hospitalId' }
                ]
            })

        pdf.create(generatePrescriptionSlip(prescription[0]), {}).toFile('Prescription.pdf', (err) => {
            if (err) {
                return Promise.reject()
            }

            return Promise.resolve().then(result => {
                res.sendFile(path.resolve('Prescription.pdf'))
            })
        })

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

export default {
    createQrPrescription,
    getQrPrescription,
    getQRPrescriptionSlip
}
