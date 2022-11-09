import mongoose, { Schema } from 'mongoose'
import { UserStatus } from '../../constants/roles'
import IEmployeeRequest from '../../interfaces/employees/employeeRequest'

const EmployeeRequestSchema: Schema = new Schema(
    {
        type: {
            type: String,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        },
        reason: {
            type: String,
            required: true
        },
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            index: false 
        },
        leavePdf: {
            type: String,
            required: false
        },
        status: {
            type: String,
            required: true,
            default: UserStatus.PENDING
        },
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IEmployeeRequest>('EmployeeRequest', EmployeeRequestSchema)