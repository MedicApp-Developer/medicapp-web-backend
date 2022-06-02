import mongoose, { Schema } from 'mongoose';
import INurse from '../../interfaces/nurse/nurse';

const NurseSchema: Schema = new Schema(
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
        mobile: {
            type: String,
            required: true
        },
        hospitalId: {
            type: Schema.Types.ObjectId,
            ref: "Hospital",
            index: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<INurse>('Nurse', NurseSchema);