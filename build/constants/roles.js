"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.Roles = void 0;
var Roles = /** @class */ (function () {
    function Roles() {
    }
    Roles.PATIENT = "PATIENT";
    Roles.HOSPITAL = "HOSPITAL";
    Roles.NURSE = "NURSE";
    Roles.DOCTOR = "DOCTOR";
    Roles.LABORTORY = "LABORTORY";
    Roles.PHARMACY = "PHARMACY";
    Roles.ADMIN = "ADMIN";
    Roles.VENDOR = "VENDOR";
    return Roles;
}());
exports.Roles = Roles;
var UserStatus = /** @class */ (function () {
    function UserStatus() {
    }
    UserStatus.APPROVED = "APPROVED";
    UserStatus.PENDING = "PENDING";
    return UserStatus;
}());
exports.UserStatus = UserStatus;
