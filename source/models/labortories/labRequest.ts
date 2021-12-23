import mongoose, { Schema } from 'mongoose';
import ILabortoryRequest from '../../interfaces/labortories/labRequest';

const LabortoryRequestSchema: Schema = new Schema(
    {
        slotId: {
            type: Schema.Types.ObjectId,
            ref: "Slot",
            index: false
        },
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "Doctor",
            index: false
        },
        patientId: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            index: false
        },
        laboratoryId: {
            type: Schema.Types.ObjectId,
            ref: "Labortory",
            index: false
        },
        tests: {
            type: [{
                test: String,
                result: String,
                range: String
            }],
            required: true
        },
        status: {
            type: String,
            default: "pending"
        },
        date: {
            type: String,
            default: new Date().toISOString()
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ILabortoryRequest>('LabortoryRequest', LabortoryRequestSchema);