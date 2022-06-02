import { Document } from 'mongoose';

export default interface IBookmark extends Document {
    hospitalIds: string[];
    doctorIds: string[];
    user: string;
}