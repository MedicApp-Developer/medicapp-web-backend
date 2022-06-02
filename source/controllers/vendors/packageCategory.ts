import { NextFunction, Request, Response } from 'express'
import PackageCategory from '../../models/vendors/packageCategory'
import makeResponse from '../../functions/makeResponse'
import cloudinary from 'cloudinary'
import config from '../../config/config'
import Package from '../../models/vendors/package'

const NAMESPACE = "PackageCategory"

const createPackageCategory = async (req: Request, res: Response, next: NextFunction) => {
	const { name_en, name_ar } = req.body;

	// @ts-ignore
	cloudinary.v2.config({
		cloud_name: config.cloudinary.name,
		api_key: config.cloudinary.apiKey,
		api_secret: config.cloudinary.secretKey
	})

	// @ts-ignore
	const result = await cloudinary.uploader.upload(req.file.path)

	const newPackageCategory = new PackageCategory({ name_en, name_ar, image: result.url })
	newPackageCategory.save().then(result => {
		return makeResponse(res, 201, "Package Category Created Successfully", result, false)
	})
		.catch(err => {
			return makeResponse(res, 400, err.message, null, true)
		})
}

const getAllPackageCategories = (req: Request, res: Response, next: NextFunction) => {
	PackageCategory.find({})
		.then(result => {
			return makeResponse(res, 200, "All Package Category", result, false)
		})
		.catch(err => {
			return makeResponse(res, 400, err.message, null, true)
		})
}

const getSinglePackageCategory = (req: Request, res: Response, next: NextFunction) => {
	PackageCategory.findById({ _id: req.params.id })
		.then(data => {
			return makeResponse(res, 200, "Package Category", data, false)
		}).catch(err => {
			return makeResponse(res, 400, err.message, null, true)
		})
}

const updatePackageCategory = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;

	try {

		const filter = { _id: id }
		let update = { name_en: req.body.name_en, name_ar: req.body.name_ar }

		// @ts-ignore
		if (req.file.path) {
			// @ts-ignore
			cloudinary.v2.config({
				cloud_name: config.cloudinary.name,
				api_key: config.cloudinary.apiKey,
				api_secret: config.cloudinary.secretKey
			})

			// @ts-ignore
			const result = await cloudinary.uploader.upload(req.file.path)
			// @ts-ignore
			update = { ...update, image: result.url }
		}

		await PackageCategory.findOneAndUpdate(filter, update);
		const newCategories = await PackageCategory.find({});
		return makeResponse(res, 200, "Vendor Type Updated", newCategories, false)
	} catch (err) {
		return res.sendStatus(400)
	}
}

const deletePackageCategory = async (req: Request, res: Response, next: NextFunction) => {
	const _id = req.params.id
	try {
		const packageCategory = await PackageCategory.findByIdAndDelete(_id)
		if (!packageCategory) return res.sendStatus(404)
		return makeResponse(res, 200, "Deleted Successfully", packageCategory, false)
	} catch (e) {
		return res.sendStatus(400)
	}
}

const getPackageCategoryOffers = async (req: Request, res: Response, next: NextFunction) => {
	const categoryId = req.params.id
	try {

		const packages = await Package.find({ category_id: categoryId }).populate("vendorId").populate("category_id");
		return makeResponse(res, 200, "Offers on this package", packages, false)

	} catch (e) {
		return res.sendStatus(400)
	}
}

export default {
	createPackageCategory,
	getAllPackageCategories,
	getSinglePackageCategory,
	updatePackageCategory,
	deletePackageCategory,
	getPackageCategoryOffers
}
