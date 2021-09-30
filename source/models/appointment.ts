import mongoose, { Schema } from 'mongoose';
import IAppointment from '../interfaces/appointment';

const AppointmentSchema: Schema = new Schema(
    {
        time: {
            type: String,
            required: true
        },
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "Doctor",
            index: false
        },
        patientId: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            index: false
        },
        hospitalId: {
            type: Schema.Types.ObjectId,
            ref: "Hospital",
            index: false
        }
    }
);

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
