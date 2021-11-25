import { Document } from 'mongoose';

export default interface IQrPrescription extends Document {
    patientId: string;
    doctorId: string;
    date: string;
    data: string;
}