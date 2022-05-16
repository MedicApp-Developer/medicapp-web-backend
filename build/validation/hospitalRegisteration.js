"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHospitalRegisteration = void 0;
var validator_1 = __importDefault(require("validator"));
var is_empty_1 = __importDefault(require("is-empty"));
function validateHospitalRegisteration(data) {
    var errors = {};
    // Convert empty fields to an empty string so we can use validator functions
    data.name = !(0, is_empty_1.default)(data.name) ? data.name : "";
    data.phoneNo = !(0, is_empty_1.default)(data.phoneNo) ? data.phoneNo : "";
    data.email = !(0, is_empty_1.default)(data.email) ? data.email : "";
    data.tradeLicenseNo = !(0, is_empty_1.default)(data.tradeLicenseNo) ? data.tradeLicenseNo : "";
    data.issueDate = !(0, is_empty_1.default)(data.issueDate) ? data.issueDate : "";
    data.expiryDate = !(0, is_empty_1.default)(data.expiryDate) ? data.expiryDate : "";
    data.password = !(0, is_empty_1.default)(data.password) ? data.password : "";
    if (validator_1.default.isEmpty(data.name)) {
        // @ts-ignore
        errors.name = "Name field is required";
    }
    if (validator_1.default.isEmpty(data.phoneNo)) {
        // @ts-ignore
        errors.phoneNo = "Phone No field is required";
    }
    // Email checks
    if (validator_1.default.isEmpty(data.email)) {
        // @ts-ignore
        errors.email = "Email field is required";
    }
    else if (!validator_1.default.isEmail(data.email)) {
        // @ts-ignore
        errors.email = "Email is invalid";
    }
    if (validator_1.default.isEmpty(data.tradeLicenseNo)) {
        // @ts-ignore
        errors.tradeLicenseNo = "Trade License No field is required";
    }
    if (validator_1.default.isEmpty(data.issueDate)) {
        // @ts-ignore
        errors.issueDate = "Issue Date field is required";
    }
    if (validator_1.default.isEmpty(data.expiryDate)) {
        // @ts-ignore
        errors.expiryDate = "Expiry Date field is required";
    }
    // Password checks
    if (validator_1.default.isEmpty(data.password)) {
        // @ts-ignore
        errors.password = "Password field is required";
    }
    return {
        errors: errors,
        isValid: (0, is_empty_1.default)(errors)
    };
}
exports.validateHospitalRegisteration = validateHospitalRegisteration;
;
