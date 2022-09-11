import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import User from '../../models/user'
import makeResponse, { sendErrorResponse } from '../../functions/makeResponse'
import UserController from '../user'
import { Roles } from '../../constants/roles'
import { sendEmail } from '../../functions/mailer'
import { sendSupportEmail } from '../../functions/supportMailer'
import { getRandomPassword } from '../../functions/utilities'
import config from '../../config/config'
import { Pagination } from '../../constants/pagination'
import Vendor from '../../models/vendors/vendor'
import bcryptjs from 'bcryptjs';
import cloudinary from 'cloudinary'

const NAMESPACE = "Doctor"

const registerVendor = async (req: Request, res: Response, next: NextFunction) => {
	const { email, firstName, lastName, phoneNo, about, address, branch_name } = req.body
	const password = getRandomPassword()

	if (email && firstName && lastName && phoneNo && address && branch_name) {
		await User.find({ email }).then((result: any) => {
			if (result.length === 0) {

				if (email && firstName && lastName && phoneNo) {
					const newVendor = new Vendor({
						_id: new mongoose.Types.ObjectId(),
						address, email, password, firstName, lastName, phoneNo, role: Roles.VENDOR, about, branch_name
					})

					const options = {
						from: config.mailer.user,
						to: email,
						subject: "Welcome to Medicapp",
						text: `Your account has been created as a vendor, and your password is ${password}`
					}

					sendSupportEmail(options, false)

					return newVendor.save()
						.then(async (result: any) => {
							await UserController.createUserFromEmailAndPassword(req, res, email, password, firstName, lastName, "", Roles.VENDOR, result._id)
							return makeResponse(res, 201, "Vendor Created Successfully", result, false)
						})
						.catch(err => {
							return makeResponse(res, 400, err.message, null, true)
						})
				} else {
					return makeResponse(res, 400, "Validation Failed", null, true)
				}
			} else {
				return makeResponse(res, 400, "Email Already in use", null, true)
			}
		})
	} else {
		return makeResponse(res, 400, "Validation Failed", null, true)
	}
}

const getAllVendors = async (req: Request, res: Response, next: NextFunction) => {
	Vendor.find({})
		.then(result => {
			return makeResponse(res, 200, "All Vendors", result, false)
		})
		.catch(err => {
			return makeResponse(res, 400, err.message, null, true)
		})
}

const uploadProfilePic = async (req: Request, res: Response, next: NextFunction) => {
	// @ts-ignore
	cloudinary.v2.config({
		cloud_name: config.cloudinary.name,
		api_key: config.cloudinary.apiKey,
		api_secret: config.cloudinary.secretKey
	})

	// @ts-ignore
	const result = await cloudinary.uploader.upload(req.file.path)

	// This id is updated hospital itself id 
	const { id } = req.params

	const filter = { _id: id }

	// @ts-ignore
	Vendor.findOneAndUpdate(filter, { image: result.url }, { new: true }).then(updatedVendor => {
		return makeResponse(res, 200, "Vendor profile picture uploaded Successfully", updatedVendor, false)
	}).catch(err => {
		return makeResponse(res, 400, err.message, null, true)
	})
}

const deleteGalleryImage = async (req: Request, res: Response, next: NextFunction) => {
	const { url, vendorId } = req.params;
	
	

	// @ts-ignore
	cloudinary.v2.config({
		cloud_name: config.cloudinary.name,
		api_key: config.cloudinary.apiKey,
		api_secret: config.cloudinary.secretKey
	})

	// @ts-ignore
	const result = await cloudinary.v2.uploader.destroy(url)
		.then(async result => {
			if (result.result === "ok") {
				const vendor = await Vendor.findById(vendorId);

				const updatedVendorImages = vendor?.images?.filter((item) => {
					return !item.includes(url)
				}) ?? []

				Vendor.findOneAndUpdate({ _id: vendorId }, { images: updatedVendorImages }, { new: true })
					.then(updatedVendor => {
						

						return makeResponse(res, 200, "Vandor gallery image deleted", updatedVendor, false)
					})
					.catch(err => {
						return sendErrorResponse(res, 400, 'Failed to delete image', 1)
					})
			} else {
				return sendErrorResponse(res, 400, 'Failed to delete image', 1)
			}
		})
		.catch(err => {
			return sendErrorResponse(res, 400, 'Failed to delete image', 1)
		});
}

const updateVendor = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params

	try {
		const update = JSON.parse(JSON.stringify({ ...req.body }))

		if (!update.password) {
			delete update.password;
		} else {
			bcryptjs.hash(update.password, 10, async (hashError, hash) => {
				if (hashError) {
					return false;
				}
				update.password = hash;
				const userFilter = { referenceId: id };

				await User.findOneAndUpdate(userFilter, update);
			})
		}

		const vendorFilter = { _id: id };

		const vendor = await Vendor.findOneAndUpdate(vendorFilter, update, { new: true });

		return makeResponse(res, 200, "Vendor updated Successfully", vendor, false)

	} catch (err: any) {
		return makeResponse(res, 400, err.message, null, true)
	}
}

const deleteVendor = async (req: Request, res: Response, next: NextFunction) => {
	const _id = req.params.id
	try {
		const vendor = await Vendor.findByIdAndDelete(_id)
		if (!vendor) return res.sendStatus(404)
		await UserController.deleteUserWithEmail(vendor.email)
		return makeResponse(res, 200, "Deleted Successfully", vendor, false)
	} catch (e) {
		return res.sendStatus(400)
	}
}

const getSingleVendors = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;
	try {
		const vendor = await Vendor.findById({ _id: id })
		if (!vendor) return res.sendStatus(404)
		return makeResponse(res, 200, "Vendor details", vendor, false)
	} catch (e) {
		return res.sendStatus(400)
	}
}

const uploadVendorImages = async (req: Request, res: Response, next: NextFunction) => {
	// @ts-ignore
	cloudinary.v2.config({
		cloud_name: config.cloudinary.name,
		api_key: config.cloudinary.apiKey,
		api_secret: config.cloudinary.secretKey
	})

	// @ts-ignore
	const result = await cloudinary.uploader.upload(req.file.path)

	const { id } = req.params

	const filter = { _id: id }

	// @ts-ignore
	let update = { $push: { images: [result.url] } }

	Vendor.findOneAndUpdate(filter, update).then((updatedVendor: any) => {
		return makeResponse(res, 200, "Vendor image uploaded Successfully", { url: result.url }, false)
	}).catch((err: any) => {
		return makeResponse(res, 400, err.message, null, true)
	})
}

const deleteProfileImage = async (req: Request, res: Response, next: NextFunction) => {
	const { vendorId } = req.params;
	

	Vendor.findOneAndUpdate({ _id: vendorId }, { image: '' }, { new: true })
		.then(updatedVendor => {
			return makeResponse(res, 200, "Nurse profile picture removed", updatedVendor, false)
		})
		.catch(err => {
			return makeResponse(res, 400, err.message, null, true)
		})
}

export default {
	registerVendor,
	getAllVendors,
	deleteVendor,
	updateVendor,
	getSingleVendors,
	uploadVendorImages,
	uploadProfilePic,
	deleteProfileImage,
	deleteGalleryImage
}
