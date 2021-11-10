import mongoose, { Schema } from 'mongoose';
import ISpeciality from '../../interfaces/doctors/speciality';

const SpecialitySchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ISpeciality>('Speciality', SpecialitySchema);