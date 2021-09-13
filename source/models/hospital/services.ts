import mongoose, { Schema } from 'mongoose';
import IServices from '../../interfaces/hospitals/services';

const AddonSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    }
);

export default mongoose.model<IServices>('Services', AddonSchema);