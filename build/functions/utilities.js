"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomPassword = void 0;
var getRandomPassword = function () {
    return Math.random().toString(36).slice(-8);
};
exports.getRandomPassword = getRandomPassword;
