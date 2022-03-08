import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import User from '../../models/user'
import makeResponse from '../../functions/makeResponse'
import UserController from '../user'
import { Roles } from '../../constants/roles'
import { sendEmail } from '../../functions/mailer'
import { getRandomPassword } from '../../functions/utilities'
import config from '../../config/config'
import { Pagination } from '../../constants/pagination'
import Vendor from '../../models/vendors/vendor'

const NAMESPACE = "Doctor"

const registerVendor = async (req: Request, res: Response, next: NextFunction) => {
	const { email, firstName, lastName, phoneNo, about } = req.body
	const password = getRandomPassword()

	if (email && firstName && lastName && phoneNo) {
		await User.find({ email }).then((result: any) => {
			if (result.length === 0) {

				if (email && firstName && lastName && phoneNo) {
					const newVendor = new Vendor({
						_id: new mongoose.Types.ObjectId(),
						email, password, firstName, lastName, phoneNo, role: Roles.VENDOR, about
					})

					const options = {
						from: config.mailer.user,
						to: email,
						subject: "Welcome to Medicapp",
						text: `Your account has been created as a vendor, and your password is ${password}`
					}

					sendEmail(options)

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

const updateVendor = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params

	try {
		const update = JSON.parse(JSON.stringify({ ...req.body }))

		const vendorFilter = { _id: id };
		const userFilter = { referenceId: id };

		await User.findOneAndUpdate(userFilter, update);

		const vendor = await Vendor.findOneAndUpdate(vendorFilter, update);

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

export default {
	registerVendor,
	getAllVendors,
	deleteVendor,
	updateVendor
}
