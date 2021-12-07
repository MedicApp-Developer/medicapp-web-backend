import mongoose, { Schema } from 'mongoose';
import { Roles } from '../../constants/roles';
import IHospital from '../../interfaces/hospitals/hospital';

const HospitalSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: false
        },
        phoneNo: {
            type: String,
            required: false
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            index: false
        },
        services: {
            type: [Schema.Types.ObjectId],
            ref: "Services",
            index: false
        },
        role: {
            type: String,
            required: false,
            default: Roles.HOSPITAL,
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
            required: false
        },
        location: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
        },
        images: {
             type: [String]
        },
        about: {
            type: String
        },
        openingTime: {
            type: String
        },
        closingTime: {
            type: String
        },
        PCRDPI: {
            type: Boolean
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IHospital>('Hospital', HospitalSchema);