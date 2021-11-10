import mongoose, { Schema } from 'mongoose';
import IDoctor from '../../interfaces/doctors/doctor';

const DoctorSchema: Schema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        },
        hospitalId: {
            type: Schema.Types.ObjectId,
            ref: "Hospital",
            index: false
        },
        specialityId: {
            type: Schema.Types.ObjectId,
            ref: "Speciality",
            index: false
        },
        experience: {
            type: String,
            required: false
        },
        description: {
            type: String,
            required: false
        },
        about: {
            type: String,
            required: false
        },
        schedule: {
            monday: {
                startTime: {
                    type: String,
                    required: false
                },
                endTime: {
                    type: String,
                    required: false
                }
            },
            tuesday: {
                startTime: {
                    type: String,
                    required: false
                },
                endTime: {
                    type: String,
                    required: false
                }
            },
            wednesday: {
                startTime: {
                    type: String,
                    required: false
                },
                endTime: {
                    type: String,
                    required: false
                }
            },
            thursday: {
                startTime: {
                    type: String,
                    required: false
                },
                endTime: {
                    type: String,
                    required: false
                }
            },
            friday: {
                startTime: {
                    type: String,
                    required: false
                },
                endTime: {
                    type: String,
                    required: false
                }
            },
            satureday: {
                startTime: {
                    type: String,
                    required: false
                },
                endTime: {
                    type: String,
                    required: false
                }
            },
            sunday: {
                startTime: {
                    type: String,
                    required: false
                },
                endTime: {
                    type: String,
                    required: false
                }
            },
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IDoctor>('Doctor', DoctorSchema);