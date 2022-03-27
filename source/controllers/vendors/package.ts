import { NextFunction, Request, Response } from 'express'
import makeResponse from '../../functions/makeResponse'
import Package from '../../models/vendors/package'
import cloudinary from 'cloudinary'
import config from '../../config/config'

const NAMESPACE = "Package"

const createPackage = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { type, points, buyQuantity, getQuantity, off, vendorId, category_id, about, termsAndConditions } = req.body;

		// @ts-ignore
		cloudinary.v2.config({
			cloud_name: config.cloudinary.name,
			api_key: config.cloudinary.apiKey,
			api_secret: config.cloudinary.secretKey
		})

		// @ts-ignore
		const result = await cloudinary.uploader.upload(req.file.path)

		const newPackage = { images: [result.url], type, points, buyQuantity, getQuantity, off, vendorId, category_id, about, termsAndConditions };

		const packge = await new Package(newPackage).save().then(t => t.populate('vendorId').populate('category_id').execPopulate());

		return makeResponse(res, 200, "Package Created Successfully", packge, false)

	} catch (err: any) {
		return makeResponse(res, 400, err.message, null, true)
	}
}

const getAllPackages = async (req: Request, res: Response, next: NextFunction) => {
	Package.find({}).populate("packageId").populate("patientId").populate("vendorId").populate("category_id")
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
		let update = JSON.parse(JSON.stringify({ ...req.body }))

		const filter = { _id: id };

		// @ts-ignore
		if (req?.file?.path) {
			// @ts-ignore
			cloudinary.v2.config({
				cloud_name: config.cloudinary.name,
				api_key: config.cloudinary.apiKey,
				api_secret: config.cloudinary.secretKey
			})

			// @ts-ignore
			const result = await cloudinary.uploader.upload(req.file.path)
			update = { ...update, images: [result.url] }
		}

		await Package.findOneAndUpdate(filter, update);

		const newPackage = await Package.findById({ _id: id }).populate("packageId").populate("patientId").populate("vendorId").populate("category_id");

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
		const result = await Package.findById({ _id }).populate("packageId").populate("patientId").populate("vendorId").populate("category_id");
		return makeResponse(res, 200, "Single Package", result, false)
	} catch (e) {
		return res.sendStatus(400)
	}
}

const getVendorPackages = async (req: Request, res: Response, next: NextFunction) => {
	const vendorId = req.params.vendorId
	try {
		const result = await Package.find({ vendorId }).populate("packageId").populate("patientId").populate("vendorId").populate("category_id");
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
