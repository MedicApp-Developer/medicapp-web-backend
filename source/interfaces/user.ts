import { Document } from 'mongoose';

export default interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    address: {
        address1: string;
        address2: string;
        city: string;
        postalCode: string;
    }
}