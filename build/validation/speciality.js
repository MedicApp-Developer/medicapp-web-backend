"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var validator_1 = __importDefault(require("validator"));
var is_empty_1 = __importDefault(require("is-empty"));
var validateSpecialityInput = function (data) {
    var errors = {};
    // Convert empty fields to an empty string so we can use validator functions
    data.name_en = !(0, is_empty_1.default)(data.name_en) ? data.name_en : "";
    data.name_ar = !(0, is_empty_1.default)(data.name_ar) ? data.name_ar : "";
    data.tags = !(0, is_empty_1.default)(data.tags) ? data.tags : "";
    data.order = !(0, is_empty_1.default)(data.order) ? data.order : "";
    if (validator_1.default.isEmpty(data.name_en)) {
        errors.name_en = "English Name field is required";
    }
    if (validator_1.default.isEmpty(data.name_ar)) {
        errors.name_ar = "Arabic Name field is required";
    }
    if (validator_1.default.isEmpty(data.order)) {
        errors.order = "Order field is required";
    }
    if (validator_1.default.isEmpty(data.tags)) {
        errors.tags = "Tags field is required";
    }
    return {
        errors: errors,
        isValid: (0, is_empty_1.default)(errors)
    };
};
exports.default = validateSpecialityInput;
