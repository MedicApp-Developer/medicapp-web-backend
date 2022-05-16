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
    data.firstName = !(0, is_empty_1.default)(data.firstName) ? data.firstName : "";
    data.lastName = !(0, is_empty_1.default)(data.lastName) ? data.lastName : "";
    data.email = !(0, is_empty_1.default)(data.email) ? data.email : "";
    data.birthday = !(0, is_empty_1.default)(data.birthday) ? data.birthday : "";
    data.gender = !(0, is_empty_1.default)(data.gender) ? data.gender : "";
    data.location = !(0, is_empty_1.default)(data.location) ? data.location : "";
    data.phone = !(0, is_empty_1.default)(data.phone) ? data.phone : "";
    data.password = !(0, is_empty_1.default)(data.password) ? data.password : "";
    data.emiratesId = !(0, is_empty_1.default)(data.emiratesId) ? data.emiratesId : "";
    if (validator_1.default.isEmpty(data.firstName)) {
        // @ts-ignore
        errors.firstName = "First Name field is required";
    }
    if (validator_1.default.isEmpty(data.lastName)) {
        // @ts-ignore
        errors.lastName = "Last Name field is required";
    }
    if (validator_1.default.isEmpty(data.emiratesId)) {
        // @ts-ignore
        errors.emiratesId = "Emirates Id field is required";
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
        isValid: (0, is_empty_1.default)(errors)
    };
}
exports.validatePatientRegisteration = validatePatientRegisteration;
;
