import { Document } from 'mongoose';

export default interface ISpeciality extends Document {
    name: string;
}