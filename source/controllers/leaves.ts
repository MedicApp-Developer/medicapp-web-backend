import { NextFunction, Request, Response } from 'express'
import makeResponse, { sendErrorResponse } from '../functions/makeResponse'

import { SERVER_ERROR_CODE } from '../constants/statusCode'
import Leave from '../models/leave'

const NAMESPACE = "Sick Leaves"

const createLeave = async (req: Request, res: Response, next: NextFunction) => {
	const { days, description, patientId, doctorId } = req.body

	try {

		const leaves = new Leave({
			days: parseInt(days), description, patientId, doctorId
		})

		await leaves.save()

		return makeResponse(res, 200, "Leave", leaves, false)

	} catch (err) {
		// @ts-ignore
		return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
	}
}

const getSickLeaves = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params
	try {
		const leaves = await Leave.find({ patientId: id })

		return makeResponse(res, 200, "Leaves", leaves, false)

	} catch (err) {
		// @ts-ignore
		return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
	}
}

export default {
	createLeave,
	getSickLeaves
}
