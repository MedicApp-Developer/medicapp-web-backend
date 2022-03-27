import mongoose, { Schema } from 'mongoose';
import { POINTS_CODE } from '../constants/rewards';
import IPointsCode from '../interfaces/patient/PointsCode';

const PointsCodeSchema: Schema = new Schema(
	{
		code: {
			type: String,
			required: true
		},
		status: {
			type: String,
			default: POINTS_CODE.PENDING
		},
		patientId: {
			type: Schema.Types.ObjectId,
			ref: "Patient",
			index: false
		},
		hospitalId: {
			type: Schema.Types.ObjectId,
			ref: "Hospital",
			index: false
		},
		slotId: {
			type: Schema.Types.ObjectId,
			ref: "Slot",
			index: false
		}
	},
	{
		timestamps: true
	}
);

export default mongoose.model<IPointsCode>('PointsCode', PointsCodeSchema);