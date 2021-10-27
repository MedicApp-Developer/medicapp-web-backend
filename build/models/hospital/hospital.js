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
var HospitalSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: false
    },
    phoneNo: {
        type: String,
        required: false
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        index: false
    },
    services: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Services",
        index: false
    },
    tradeLicenseNo: {
        type: String,
        required: true
    },
    issueDate: {
        type: String,
        required: true
    },
    expiryDate: {
        type: String,
        required: true
    },
    tradeLicenseFile: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
    },
    images: {
        type: [String]
    },
    about: {
        type: String
    },
    openingTime: {
        type: String
    },
    closingTime: {
        type: String
    },
    PCRDPI: {
        type: Boolean
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Hospital', HospitalSchema);
