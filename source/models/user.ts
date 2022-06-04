import mongoose, { Schema } from 'mongoose';
import { UserStatus } from '../constants/roles';
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
        phoneNo: {
            type: String,
            required: false
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
        },
        resetLink: {
            data: String,
            default: ''
        },
        status: {
            type: String,
            default: UserStatus.APPROVED
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUser>('User', UserSchema);