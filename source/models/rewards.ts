import mongoose, { Schema } from 'mongoose';
import { RewardStatus } from '../constants/rewards';
import IRewards from '../interfaces/patient/rewards';

const RewardsSchema: Schema = new Schema(
	{
		code: {
			type: String,
			required: true
		},
		status: {
			type: String,
			default: RewardStatus.PENDING
		},
		packageId: {
			type: Schema.Types.ObjectId,
			ref: "Package",
			index: false
		},
		vendorId: {
			type: Schema.Types.ObjectId,
			ref: "Vendor",
			index: false
		},
		patientId: {
			type: Schema.Types.ObjectId,
			ref: "Patient",
			index: false
		}
	},
	{
		timestamps: true
	}
);

export default mongoose.model<IRewards>('Rewards', RewardsSchema);