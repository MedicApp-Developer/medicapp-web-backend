import mongoose, { Schema } from 'mongoose';
import IPromos from '../../interfaces/hospitals/promos';

const PromoSchema: Schema = new Schema(
    {
        url: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        key: {
            type: String,
            required: true
        },
        likes: {
            type: Number,
            required: true,
            default: 0
        },
        hospitalId: {
            type: Schema.Types.ObjectId,
            ref: "Hospital",
            index: false
        }
    }
);

export default mongoose.model<IPromos>('Promos', PromoSchema);