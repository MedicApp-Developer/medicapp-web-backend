import mongoose, { Schema } from 'mongoose';
import { SlotStatus } from '../../constants/slot';
import ISlot from '../../interfaces/doctors/slot';

const SlotSchema: Schema = new Schema(
    {
        date: {
            type: String,
            required: true
        },
        timeFrom: {
            type: String,
            required: true
        },
        timeTo: {
            type: String,
            required: true
        },
        dateTimeTo: {
            type: String,
            required: true
        },
        dateTimeFrom: {
            type: String,
            required: true
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