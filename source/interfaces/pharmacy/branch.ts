import { Document } from 'mongoose';

export default interface IBranch extends Document {
    location: string;
    mobile: string;
    about: string;
    pharmacyId: string;
}