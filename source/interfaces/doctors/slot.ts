import { Document } from 'mongoose';

export default interface ISlot extends Document {
    from: string;
    to: string;
    appointmentId: string;
    doctorId: string;
    hospitalId: string;
    status: string;
}