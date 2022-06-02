import mongoose, { Schema } from 'mongoose';
import ILabortory from '../../interfaces/labortories/labortory';

const LabortorySchema: Schema = new Schema(
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

export default mongoose.model<ILabortory>('Labortory', LabortorySchema);