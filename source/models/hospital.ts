import mongoose, { Schema } from 'mongoose';
import IHospital from '../interfaces/hospital';

const HospitalSchema: Schema = new Schema(
    {
        name: {
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
        tradeLicense: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IHospital>('Hospital', HospitalSchema);