import { firebaserules_v1 } from 'googleapis';
import mongoose, { Schema } from 'mongoose';
import IBookmark from '../interfaces/bookmark';

const BookmarkSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: false
        },
        hospitalIds: {
            type: [String],
            required: false,
            default: []
        },
        doctorIds: {
            type: [String],
            required: false,
            default: []
        } 
    }
);

export default mongoose.model<IBookmark>('Bookmark', BookmarkSchema);
