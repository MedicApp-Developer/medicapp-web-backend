import mongoose, { Schema } from 'mongoose';
import ITodo from '../../interfaces/ceo/todo';

const TodoSchema: Schema = new Schema(
    {
        from: Date,
        to: Date,
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
        date: {
            type: String,
            required: false,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ITodo>('Todo', TodoSchema);