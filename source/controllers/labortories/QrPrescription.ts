import { NextFunction, Request, Response } from 'express';
import { Pagination } from '../../constants/pagination';
import { Roles } from '../../constants/roles';
import makeResponse from '../../functions/makeResponse';
import QrPrescription from '../../models/labortories/QrPrescription';

const NAMESPACE = "QR Prescription";

const createQrPrescription = async (req: Request, res: Response, next: NextFunction) => {
    const { patientId, data } = req.body;
    
    const qrPrescription = new QrPrescription(
        { patientId, data }
    );

    return qrPrescription.save()
    .then(result => {
        return makeResponse(res, 201, "QR Prescription Created Successfully", result, false);
    })
    .catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

const getQrPrescription = async (req: Request, res: Response, next: NextFunction) => {
    QrPrescription.find({ patientId: res.locals.jwt.reference_id }).then(prescriptions => {
        return makeResponse(res, 201, "QR Prescription Created Successfully", prescriptions, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
};

export default { 
    createQrPrescription,
    getQrPrescription
};
