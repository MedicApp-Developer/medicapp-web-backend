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
		images: {
			type: [String]
		},
		address: {
			type: String,
			required: true
		},
		branch_name: {
			type: String,
			required: true
		},
		location: {
			type: {
				type: String,
				enum: ['Point'],
				default: 'Point',
			},
			coordinates: {
				type: [Number],
				default: [0, 0],
			}
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