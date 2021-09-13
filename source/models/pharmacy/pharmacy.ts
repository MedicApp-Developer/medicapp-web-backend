import mongoose, { Schema } from 'mongoose';
import IPharmacy from '../../interfaces/pharmacy/pharmacy';

const PharmacySchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        tradeLicenseNo: {
            type: String,
            required: true
        },
        issueDate: {
            type: String,
            required: true
        },
        expiryDate: {
            type: String,
            required: true
        },
        tradeLicenseFile: {
            type: String,
            required: true
        },
        noOfBranches: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IPharmacy>('Pharmacy', PharmacySchema);