import mongoose, { Schema } from 'mongoose';
import IFamily from '../interfaces/family';

const FamilySchema: Schema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        relation: {
            type: String,
            required: true
        },
        emiratesId: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true
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

export default mongoose.model<IFamily>('Family', FamilySchema);
