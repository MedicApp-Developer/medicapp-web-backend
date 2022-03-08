import mongoose, { Schema } from 'mongoose';
import IPackage from '../../interfaces/vendors/packages';

const PackageSchema: Schema = new Schema(
	{
		type: {
			type: String,
			required: true
		},
		points: {
			type: String,
			required: true
		},
		buyQuantity: {
			type: String
		},
		getQuantity: {
			type: String,
			required: false
		},
		off: {
			type: String
		},
		category: {
			type: String
		},
		termsAndConditions: {
			type: String
		},
		about: {
			type: String
		},
		images: {
			type: [String]
		},
		vendorId: {
			type: Schema.Types.ObjectId,
			ref: "Vendor",
			index: false
		}
	},
	{
		timestamps: true
	}
);

export default mongoose.model<IPackage>('Package', PackageSchema);