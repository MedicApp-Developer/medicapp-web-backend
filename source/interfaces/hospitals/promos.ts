import { Document } from 'mongoose';

export default interface IPromos extends Document {
    url: string;
    name: string;
    key: string;
    likes: string;
    hospitalId: string;
}