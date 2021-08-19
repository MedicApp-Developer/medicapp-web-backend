import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user';

const UserSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true
        },
        password: { 
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        referenceId: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUser>('User', UserSchema);