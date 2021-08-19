import { Document } from 'mongoose';

export default interface IPatient extends Document {
    firstName: string;
    lastName: string;
    email: string;
    birthday: string;
    gender: string;
    emiratesId: string;
    location: string;
}