import { Document } from 'mongoose';

export default interface INurse extends Document {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    hospitalId: string;
}