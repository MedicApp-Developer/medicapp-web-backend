import { Document } from 'mongoose';

export default interface IRole extends Document {
    name: string;
    code: string;
    role: string;
    referenceId: string;
}