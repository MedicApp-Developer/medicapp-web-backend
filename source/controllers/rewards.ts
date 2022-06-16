import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Patient from '../models/patient';
import makeResponse, { sendErrorResponse } from '../functions/makeResponse';
import Rewards from '../models/rewards';
import { RewardStatus } from '../constants/rewards';
import Package from '../models/vendors/package';
import config from '../config/config';
import { sendEmail } from '../functions/mailer'
import PackageCategory from '../models/vendors/packageCategory';
const NAMESPACE = "Rewards";

const subscribePackage = async (req: Request, res: Response, next: NextFunction) => {
	const { packageId, patientId, vendorId, voucherCode } = req.body;

	try {
		const newReward = new Rewards({
			_id: new mongoose.Types.ObjectId(),
			voucherCode, packageId, patientId, vendorId
		});

		// Update Subscribed Count
		await Package.findOneAndUpdate({ _id: packageId }, { $inc: { subscribedCount: +1 } })

		const packge = await Package.findById({ _id: packageId }).populate("packageId").populate("patientId").populate("vendorId");
		if (packge) {
			if (packge.voucherCode === voucherCode) {
				const savedReward = await newReward.save();

				// @ts-ignore
				const patient = await Patient.findOneAndUpdate({ _id: patientId }, { $inc: { points: -packge.points } }, { new: true })

				// const options = {
				// 	from: config.mailer.user,
				// 	// @ts-ignore
				// 	to: patient.email,
				// 	subject: "Package Subscription",
				// 	// @ts-ignore
				// 	text: `You have successfully subscribed to ${packge.type === "ON_PERCENTAGE" ? packge.off + " % " + " off " : "BUY " + packge?.buyQuantity + " GET " + packge?.getQuantity} by ${packge.vendorId.firstName + " " + packge.vendorId.lastName} for ${packge?.points}`
				// }
				// sendEmail(options)

				return makeResponse(res, 200, "Reward registered successfully", { reward: savedReward }, false);
			} else {
				return sendErrorResponse(res, 400, 'Invalid voucher code', 1);
			}
		} else {
			return sendErrorResponse(res, 400, 'Invalid voucher code', 1);
		}




	} catch (err) {
		// @ts-ignore
		return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
	}
};

const approvePackage = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id
	try {
		const update = { status: RewardStatus.TAKEN }

		const filter = { _id: id };

		const reward = await Rewards.findOneAndUpdate(filter, update).populate("packageId").populate("patientId").populate("vendorId");

		return makeResponse(res, 200, "Package approved", reward, false)
	} catch (e) {
		return res.sendStatus(400)
	}
};

const getAllPatientRewards = async (req: Request, res: Response, next: NextFunction) => {
	const patientId = req.params.patientId
	try {

		const rewards = await Rewards.find({ patientId, status: RewardStatus.PENDING }).populate("packageId").populate("patientId").populate("vendorId");

		return makeResponse(res, 200, "Patient Subscribed Packages", rewards, false)
	} catch (e) {
		return res.sendStatus(400)
	}
};

const getAllVendorRewards = async (req: Request, res: Response, next: NextFunction) => {
	const vendorId = req.params.vendorId
	try {

		const rewards = await Rewards.find({ vendorId }).populate("packageId").populate("patientId").populate("vendorId");

		return makeResponse(res, 200, "Vendor Promo Codes", rewards, false)
	} catch (e) {
		return res.sendStatus(400)
	}
};

const getPatientRewardsHomeData = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const packageCategories = await PackageCategory.find({});
		const popularPackages = await Package.find({ "subscribedCount": { $gt: 0 } }).sort('-subscribedCount').populate("packageId").populate("patientId").populate("vendorId").populate("category_id");
		const recommendedPackages = await Package.find({ "subscribedCount": { $lt: 1 } }).sort("-off").populate("packageId").populate("patientId").populate("vendorId").populate("category_id");
		return makeResponse(res, 200, "Rewards Home Data", { categories: packageCategories, popular: popularPackages, recommended: recommendedPackages }, false)
	} catch (e) {
		return res.sendStatus(400)
	}
};

export default {
	subscribePackage,
	approvePackage,
	getAllPatientRewards,
	getAllVendorRewards,
	getPatientRewardsHomeData
};
