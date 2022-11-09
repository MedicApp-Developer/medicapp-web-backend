import mongoose, { Schema } from 'mongoose'
import { EmployeeTypes, Roles } from '../../constants/roles'
import IEmployee from '../../interfaces/employees/employee'

const EmployeeSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true,
            default: EmployeeTypes.EMPLOYEE
        },
        salary: {
            type: Number,
            required: true
        },
        emiratesId: {
            type: String,
            required: true
        },
        passportNo: {
            type: String,
            required: false
        },
        workEmail: {
            type: String,
            required: false
        },
        employeeAgreement: {
            type: String,
            required: false
        },
        passportPdf: {
            type: String,
            required: false
        },
        emiratesIdPdf: {
            type: String,
            required: false
        },
        visaPdf: {
            type: String,
            required: false
        },
        profilePic: {
            type: String,
            required: false
        },
        role: {
            type: String,
            required: false,
            default: Roles.EMPLOYEE
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IEmployee>('Employee', EmployeeSchema)