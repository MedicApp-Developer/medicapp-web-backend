"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var validator_1 = __importDefault(require("validator"));
var is_empty_1 = __importDefault(require("is-empty"));
var validateRegisterInput = function (data) {
    var errors = {};
    // Convert empty fields to an empty string so we can use validator functions
    data.firstName = !(0, is_empty_1.default)(data.firstName) ? data.firstName : "";
    data.lastName = !(0, is_empty_1.default)(data.lastName) ? data.lastName : "";
    data.email = !(0, is_empty_1.default)(data.email) ? data.email : "";
    data.password = !(0, is_empty_1.default)(data.password) ? data.password : "";
    data.password2 = !(0, is_empty_1.default)(data.password2) ? data.password2 : "";
    // firstName checks
    if (validator_1.default.isEmpty(data.firstName)) {
        errors.firstName = "firstName field is required";
    }
    if (validator_1.default.isEmpty(data.lastName)) {
        errors.lastName = "lastName field is required";
    }
    // Email checks
    if (validator_1.default.isEmpty(data.email)) {
        errors.email = "Email field is required";
    }
    else if (!validator_1.default.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }
    // Password checks
    if (validator_1.default.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }
    if (validator_1.default.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    }
    if (!validator_1.default.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }
    if (!validator_1.default.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }
    return {
        errors: errors,
        isValid: (0, is_empty_1.default)(errors),
    };
};
exports.default = validateRegisterInput;
