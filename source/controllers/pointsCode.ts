import { NextFunction, Request, Response } from 'express';
import makeResponse, { sendErrorResponse } from '../functions/makeResponse';
import PointsCode from '../models/pointsCode';
import { RECORD_NOT_FOUND, SERVER_ERROR_CODE } from '../constants/statusCode';
import { POINTS_CODE } from '../constants/rewards';
import Patient from '../models/patient';

const getHospitalPointsCode = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { hospitalId } = req.params;
		const pointsCodes = await PointsCode.find({ hospitalId }).populate("patientId").populate({
			path: 'slotId',
			populate: [
				{ path: 'doctorId' }
			]
		});
		return makeResponse(res, 200, "Hospital Points Code", pointsCodes, false)
	} catch (err) {
		return sendErrorResponse(res, 400, "Problem while getting points code", RECORD_NOT_FOUND)
	}
};

const getPatientPointsCode = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { patientId } = req.params;
		const pointsCodes = await PointsCode.find({ patientId, status: POINTS_CODE.PENDING });
		return makeResponse(res, 200, "Patient Points Code", pointsCodes, false)
	} catch (err) {
		return sendErrorResponse(res, 400, "Problem while getting points code", RECORD_NOT_FOUND)
	}
};

const verifyCode = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { code, slotId, patientId } = req.body;

		const filters = { slotId, code: code, patientId, status: POINTS_CODE.PENDING };

		const count = await PointsCode.find(filters).countDocuments();

		if (count > 0) {
			await PointsCode.findOneAndUpdate(filters, { status: POINTS_CODE.TAKEN });

			await Patient.findOneAndUpdate({ _id: patientId }, { $inc: { points: 20 } }, { new: true })

			return makeResponse(res, 200, "You have recieved 20 points", true, false)
		} else {
			return sendErrorResponse(res, 400, "Your code is Invalid OR Expired", RECORD_NOT_FOUND)
		}

	} catch (err) {
		return sendErrorResponse(res, 400, "Your code is Invalid OR Expired", RECORD_NOT_FOUND)
	}
};

export default {
	getHospitalPointsCode,
	getPatientPointsCode,
	verifyCode
};
