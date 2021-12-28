import mongoose, { Schema } from 'mongoose';
import { SlotStatus } from '../../constants/slot';
import ISlot from '../../interfaces/doctors/slot';

const SlotSchema: Schema = new Schema(
    {
        from: Date,
        to: Date,
        patientId: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
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
        },
        description: {
            type: String,
            required: false,
            default: ""
        },
        femilyMemberId: {
            type: Schema.Types.ObjectId,
            ref: "Family",
            index: false,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ISlot>('Slot', SlotSchema);