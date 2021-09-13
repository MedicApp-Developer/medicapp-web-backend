import { Document } from 'mongoose';

export default interface ILabortory extends Document {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    hospitalId: string;
}