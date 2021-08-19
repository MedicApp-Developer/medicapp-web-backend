import mongoose, { Schema } from 'mongoose';
import IPatient from '../interfaces/patient';

const PatientSchema: Schema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: { 
            type: String,
            required: true
        },
        email: { 
            type: String,
            required: true
        },
        birthday: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        emiratesId: {
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

export default mongoose.model<IPatient>('Patient', PatientSchema);