import mongoose, { Schema } from 'mongoose';
import IVendor from '../../interfaces/vendors/vendor';

const VendorSchema: Schema = new Schema(
	{
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: false
		},
		email: {
			type: String,
			required: true
		},
		phoneNo: {
			type: String,
			required: false
		},
		password: {
			type: String,
			required: true
		},
		role: {
			type: String,
			required: true
		},
		about: {
			type: String
		},
		referenceId: {
			type: String,
			required: false
		}
	},
	{
		timestamps: true
	}
);

export default mongoose.model<IVendor>('Vendor', VendorSchema);