import mongoose, { Schema } from 'mongoose'
import ICheckin from '../../interfaces/employees/checkin'

const CheckinSchema: Schema = new Schema(
    {
        checkin: {
            type: String,
            required: true
        },
        checkout: {
            type: String,
            required: false
        },
        date: {
            type: String,
            required: true
        },
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            index: false 
        },
    },
    {
        timestamps: true
    }
)

export default mongoose.model<ICheckin>('Checkin', CheckinSchema)