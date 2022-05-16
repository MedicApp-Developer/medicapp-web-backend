"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../config/config"));
var smsglobal = require('smsglobal')(config_1.default.SMSGlobal.apiKey, config_1.default.SMSGlobal.secretKey);
var sendMessage = function (destination, message) {
    var payload = {
        origin: 'Medicappae',
        destination: destination,
        message: message
    };
    console.log("payload => ", payload);
    smsglobal.sms.send(payload, function (error, response) {
        if (response) {
            console.log('Response:', response.data ? response.data : response);
        }
        if (error) {
            console.log('Error:', error);
        }
    });
};
exports.default = sendMessage;
