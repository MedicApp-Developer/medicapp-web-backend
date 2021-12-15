import mongoose, { Schema } from 'mongoose';
import { SlotStatus } from '../../constants/slot';
import ISlot from '../../interfaces/doctors/slot';

const SlotSchema: Schema = new Schema(
    {
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        },
        appointmentId: {
            type: Schema.Types.ObjectId,
            ref: "Appointment",
            index: false,
            default: null
        },
        hospitalId: {
            type: Schema.Types.ObjectId,
            ref: "Hospital",
            index: false
        }, 
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "Doctor",
            index: false
        },
        status: {
            type: String,
            required: true,
            default: SlotStatus.AVAILABLE
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ISlot>('Slot', SlotSchema);