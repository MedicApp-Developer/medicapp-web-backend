import mongoose, { Schema } from 'mongoose';
import IQrPrescription from '../../interfaces/labortories/QrPrescription';

const QrPrescriptionSchema: Schema = new Schema(
    {
        data: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        patientId: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            index: false
        },
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "Doctor",
            index: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IQrPrescription>('QrPrescription', QrPrescriptionSchema);