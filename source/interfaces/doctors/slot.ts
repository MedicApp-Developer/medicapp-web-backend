import { Document } from 'mongoose';

export default interface ISlot extends Document {
    from: string;
    to: string;
    patientId: string;
    doctorId: string;
    hospitalId: string;
    status: string;
    description: string;
    femilyMemberId: string;
}