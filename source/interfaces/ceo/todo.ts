import { Document } from 'mongoose';

export default interface ITodo extends Document {
    from: string;
    to: string;
    description: string;
    type: string;
    title: string;
    date: string;
}