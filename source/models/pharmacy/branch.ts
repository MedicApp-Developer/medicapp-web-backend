import mongoose, { Schema } from 'mongoose';
import IBranch from '../../interfaces/pharmacy/branch';

const BranchSchema: Schema = new Schema(
    {
        location: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        },
        about: {
            type: String,
            required: true
        },
        pharmacyId: {
            type: Schema.Types.ObjectId,
            ref: "Pharmacy",
            index: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IBranch>('Branch', BranchSchema);