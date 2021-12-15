import { Document } from 'mongoose';

export default interface ISlot extends Document {
    date: string;
    timeFrom: string;
    timeTo: string;
    dateTimeTo: string;
    dateTimeFrom: string;
    doctorId: string;
    hospitalId: string;
    status: string;
}