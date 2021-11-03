"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
var PatientSchema = new mongoose_1.Schema({
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
    emiratesId: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    emiratesIdFile: {
        type: String,
        required: false
    },
    issueDate: {
        type: String,
        required: true
    },
    expiryDate: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false
    },
    bloodType: {
        type: String,
        required: false
    },
    allergies: {
        type: String,
        required: false
    },
    diseases: {
        type: [String],
        required: false
    },
    height: {
        type: String,
        required: false
    },
    weight: {
        type: String,
        required: false
    },
    patientId: {
        type: String,
        required: false
    },
    lastVisit: {
        type: String,
        required: false
    },
    heartRate: {
        type: String,
        required: false
    },
    temprature: {
        type: String,
        required: false
    },
    glucose: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Patient', PatientSchema);
// TODOS: make vitals relationship between patient ( One to One/Many )
/*
        currentMedicalRecord: {
            heartRate: {
                type: String,
                required: false
            },
            bodyTemprature: {
                type: String,
                required: false
            },
            glucose: {
                type: String,
                required: false
            }
        }
*/ 
