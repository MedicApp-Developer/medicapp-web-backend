import mongoose, { Schema } from 'mongoose';
import IExpense from '../interfaces/expenses';

const ExpenseSchema: Schema = new Schema(
    {
        description: {
            type: String,
            required: false,
            default: ""
        },
        type: {
            type: String,
            required: false,
            default: ""
        },
        title: {
            type: String,
            required: false,
            default: ""
        },
        amount: {
            type: Number,
            required: false,
            default: 0
        },
        month: {
            type: Number,
            required: false,
            default: 0
        },
        year:{
            type: Number,
            required: false,
            default: 0
        },
        date: {
            type: Date,
            required: false
        },
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            index: false,
            required: false,
            default: null
        
        },
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IExpense>('Expenses', ExpenseSchema);