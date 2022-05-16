"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotTypes = exports.SlotStatus = void 0;
var SlotStatus = /** @class */ (function () {
    function SlotStatus() {
    }
    SlotStatus.AVAILABLE = "AVAILABLE";
    SlotStatus.BOOKED = "BOOKED";
    SlotStatus.APPROVED = "APPROVED";
    return SlotStatus;
}());
exports.SlotStatus = SlotStatus;
var SlotTypes = /** @class */ (function () {
    function SlotTypes() {
    }
    SlotTypes.DOCTOR = "DOCTOR"; // DEFAULT
    SlotTypes.PCR_TEST = "PCR_TEST";
    SlotTypes.PCR_VACCINATION = "PCR_VACCINATION";
    SlotTypes.MEDICAPP_PCR = "MEDICAPP_PCR";
    return SlotTypes;
}());
exports.SlotTypes = SlotTypes;
