import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user';

const UserSchema: Schema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: true
        },
        password: { 
            type: String,
            required: true
        },
        emiratesId: {
            type: String,
            required: false
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