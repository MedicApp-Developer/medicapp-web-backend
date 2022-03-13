import { NextFunction, Request, Response } from 'express'
import makeResponse from '../../functions/makeResponse'
import Package from '../../models/vendors/package'

const NAMESPACE = "Package"

const createPackage = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { type, points, buyQuantity, getQuantity, off, vendorId, category, about, termsAndConditions } = req.body;

		const newPackage = { type, points, buyQuantity, getQuantity, off, vendorId, category, about, termsAndConditions };

		const result = await new Package(newPackage).save().then(t => t.populate('vendorId').execPopulate());

		return makeResponse(res, 200, "Package Created Successfully", result, false)

	} catch (err: any) {
		return makeResponse(res, 400, err.message, null, true)
	}
}

const getAllPackages = async (req: Request, res: Response, next: NextFunction) => {
	Package.find({}).populate("packageId").populate("patientId").populate("vendorId")
		.then((result: any) => {
			return makeResponse(res, 200, "All Packages", result, false)
		})
		.catch((err: any) => {
			return makeResponse(res, 400, err.message, null, true)
		})
}

const updatePackage = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params

	try {
		const update = JSON.parse(JSON.stringify({ ...req.body }))

		const filter = { _id: id };

		await Package.findOneAndUpdate(filter, update);

		const newPackage = await Package.findById({ _id: id }).populate("packageId").populate("patientId").populate("vendorId");

		return makeResponse(res, 200, "Package updated Successfully", newPackage, false)

	} catch (err: any) {
		return makeResponse(res, 400, err.message, null, true)
	}
}

const deletePackage = async (req: Request, res: Response, next: NextFunction) => {
	const _id = req.params.id
	try {
		const deletedPackage = await Package.findByIdAndDelete(_id)
		if (!deletedPackage) return res.sendStatus(404);
		return makeResponse(res, 200, "Deleted Successfully", deletedPackage, false)
	} catch (e) {
		return res.sendStatus(400)
	}
}

const getSinglePackage = async (req: Request, res: Response, next: NextFunction) => {
	const _id = req.params.id
	try {
		const result = await Package.findById({ _id }).populate("packageId").populate("patientId").populate("vendorId");
		return makeResponse(res, 200, "Single Package", result, false)
	} catch (e) {
		return res.sendStatus(400)
	}
}

const getVendorPackages = async (req: Request, res: Response, next: NextFunction) => {
	const vendorId = req.params.vendorId
	try {
		const result = await Package.find({ vendorId }).populate("packageId").populate("patientId").populate("vendorId");
		return makeResponse(res, 200, "Vendor Packages", result, false)
	} catch (e) {
		return res.sendStatus(400)
	}
}

export default {
	createPackage,
	getAllPackages,
	deletePackage,
	updatePackage,
	getSinglePackage,
	getVendorPackages
}
