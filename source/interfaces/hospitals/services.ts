import { Document } from 'mongoose';

export default interface IServices extends Document {
    name: string;
}