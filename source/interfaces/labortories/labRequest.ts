import { Document } from 'mongoose';

export default interface ILabortoryRequest extends Document {
    appointmentId: string;
    doctorId: string;
    patientId: string;
    laboratoryId: string;
    tests: string[];
    status: string;
    date: string;
}