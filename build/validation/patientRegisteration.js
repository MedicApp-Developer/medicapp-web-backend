"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePatientRegisteration = void 0;
var validator_1 = __importDefault(require("validator"));
var is_empty_1 = __importDefault(require("is-empty"));
function validatePatientRegisteration(data) {
    var errors = {};
    // Convert empty fields to an empty string so we can use validator functions
    data.firstName = !is_empty_1.default(data.firstName) ? data.firstName : "";
    data.lastName = !is_empty_1.default(data.lastName) ? data.lastName : "";
    data.email = !is_empty_1.default(data.email) ? data.email : "";
    data.birthday = !is_empty_1.default(data.birthday) ? data.birthday : "";
    data.gender = !is_empty_1.default(data.gender) ? data.gender : "";
    data.issueDate = !is_empty_1.default(data.issueDate) ? data.issueDate : "";
    data.expiryDate = !is_empty_1.default(data.expiryDate) ? data.expiryDate : "";
    data.location = !is_empty_1.default(data.location) ? data.location : "";
    data.phone = !is_empty_1.default(data.phone) ? data.phone : "";
    data.password = !is_empty_1.default(data.password) ? data.password : "";
    if (validator_1.default.isEmpty(data.firstName)) {
        // @ts-ignore
        errors.firstName = "First Name field is required";
    }
    if (validator_1.default.isEmpty(data.lastName)) {
        // @ts-ignore
        errors.lastName = "Last Name field is required";
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
    if (validator_1.default.isEmpty(data.birthday)) {
        // @ts-ignore
        errors.birthday = "Birthday field is required";
    }
    if (validator_1.default.isEmpty(data.gender)) {
        // @ts-ignore
        errors.gender = "Gender field is required";
    }
    if (validator_1.default.isEmpty(data.issueDate)) {
        // @ts-ignore
        errors.issueDate = "Issue Date field is required";
    }
    if (validator_1.default.isEmpty(data.expiryDate)) {
        // @ts-ignore
        errors.expiryDate = "Expiry Date field is required";
    }
    if (validator_1.default.isEmpty(data.location)) {
        // @ts-ignore
        errors.location = "Location field is required";
    }
    if (validator_1.default.isEmpty(data.phone)) {
        // @ts-ignore
        errors.phone = "Phone field is required";
    }
    // Password checks
    if (validator_1.default.isEmpty(data.password)) {
        // @ts-ignore
        errors.password = "Password field is required";
    }
    return {
        errors: errors,
        isValid: is_empty_1.default(errors)
    };
}
exports.validatePatientRegisteration = validatePatientRegisteration;
;
