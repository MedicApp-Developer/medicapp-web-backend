import mongoose, { Schema } from 'mongoose';
import IArchive from '../interfaces/archive';

const ArchiveSchema: Schema = new Schema(
    {
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        pageNumber: {
            type: Number,
            required: true
        },
        hospitalId: {
            type: Schema.Types.ObjectId,
            ref: "Hospital",
            index: false
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
);

export default mongoose.model<IArchive>('Archive', ArchiveSchema);
