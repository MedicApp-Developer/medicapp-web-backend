import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Patient from '../models/patient';
import makeResponse, { sendErrorResponse } from '../functions/makeResponse';
import Rewards from '../models/rewards';
import { RewardStatus } from '../constants/rewards';
import Package from '../models/vendors/package';

const NAMESPACE = "Rewards";

const subscribePackage = async (req: Request, res: Response, next: NextFunction) => {
	const { packageId, patientId, vendorId } = req.body;

	const code = Math.floor(Math.random() * 10000000) + 1;

	try {
		const newReward = new Rewards({
			_id: new mongoose.Types.ObjectId(),
			code, packageId, patientId, vendorId
		});

		// Update Subscribed Count
		await Package.findOneAndUpdate({ _id: packageId }, { $inc: { subscribedCount: +1 } })

		const packge = await Package.findById({ _id: packageId });

		const savedReward = await newReward.save();

		// @ts-ignore
		await Patient.findOneAndUpdate({ _id: patientId }, { $inc: { points: -packge.points } }, { new: true })

		return makeResponse(res, 200, "Reward registered successfully", { reward: savedReward }, false);

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

		const reward = await Rewards.findOneAndUpdate(filter, update);

		return makeResponse(res, 200, "Package approved", reward, false)
	} catch (e) {
		return res.sendStatus(400)
	}
};

const getAllPatientRewards = async (req: Request, res: Response, next: NextFunction) => {
	const patientId = req.params.patientId
	try {

		const rewards = await Rewards.find({ patientId, status: RewardStatus.PENDING });

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
		const packageCategories = [
			"RESTAURANT",
			"WELLNESS",
			"HOTEL",
			"RETAIL"
		];
		const popularPackages = await Package.find({ "subscribedCount": { $gt: 0 } }).sort('-subscribedCount').populate("vendorId");
		const recommendedPackages = await Package.find({ "subscribedCount": { $lt: 1 } }).sort("-off").populate("vendorId");
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
