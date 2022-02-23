import { Document } from 'mongoose';

export default interface IPromos extends Document {
    url: string;
    name: string;
    likes: string;
    hospitalId: string;
}