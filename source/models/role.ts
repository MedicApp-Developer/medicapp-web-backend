import mongoose, { Schema } from 'mongoose';
import IRole from '../interfaces/role';

const RoleSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        }
    }
);

export default mongoose.model<IRole>('Role', RoleSchema);