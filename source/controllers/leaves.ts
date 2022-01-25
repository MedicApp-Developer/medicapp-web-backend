import { NextFunction, Request, Response } from 'express'
import makeResponse, { sendErrorResponse } from '../functions/makeResponse'
import path from 'path'
import { SERVER_ERROR_CODE } from '../constants/statusCode'
import Leave from '../models/leave'
import pdf from 'html-pdf'
import generateSickLeaveDocument from '../documents/SickLeave'

const NAMESPACE = "Sick Leaves"

const createLeave = async (req: Request, res: Response, next: NextFunction) => {
	const { days, description, patientId, doctorId } = req.body

	try {

		const leaves = new Leave({
			days: parseInt(days), description, patientId, doctorId, issuedDate: new Date().toISOString()
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
		const leaves = await Leave.find({ patientId: id }).populate("doctorId")

		return makeResponse(res, 200, "Leaves", leaves, false)

	} catch (err) {
		// @ts-ignore
		return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
	}
}

const downloadSickLeave = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params
	try {
		const leaves = await Leave.find({ _id: id }).populate({
			path: 'doctorId',
			populate: [
				{ path: 'hospitalId' }
			]
		}).populate("patientId")

		pdf.create(generateSickLeaveDocument(leaves[0]), {}).toFile('Sick Leave Approval.pdf', (err) => {
			if (err) {
				return Promise.reject()
			}

			return Promise.resolve().then(result => {
				res.sendFile(path.resolve('Sick Leave Approval.pdf'))
			})
		})
	} catch (err) {
		// @ts-ignore
		return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
	}
}

export default {
	createLeave,
	getSickLeaves,
	downloadSickLeave
}
