import { Document } from 'mongoose';

export default interface IExpense extends Document {
    description: string;
    type: string;
    title: string;
    amount: Number;
    month: Number;
    year: Number;
    date: Date;
    employeeId: any;
}