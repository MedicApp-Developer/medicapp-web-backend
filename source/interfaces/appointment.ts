import { Document } from 'mongoose';

export default interface IAppointment extends Document {
    time: string;
    doctorId: string;
    patientId: string;
    hospitalId: string;
    date: string;
}