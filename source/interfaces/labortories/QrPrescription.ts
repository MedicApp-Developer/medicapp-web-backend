import { Document } from 'mongoose';

export default interface IQrPrescription extends Document {
    patientId: string;
    data: string;
}