"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
var config_1 = __importDefault(require("../config/config"));
var transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: config_1.default.mailer.user,
        pass: config_1.default.mailer.pass
    }
});
// For Reference
// const options = {
//     from: "usamafarooq2007@gmail.com",
//     to: "usamamughal2007@gmail.com, muhammadusama2007@gmail.com",
//     cc: "usamamughal2007@gmail.com",
//     bcc: "usamamughal2007@gmail.com",
//     subject: "Sending Test Email With Node",
//     text: "WOW! That's Simple"
// }
var sendEmail = function (options) {
    transporter.sendMail(options).then(function (res) {
        console.log("Email Sent");
        return true;
    }).catch(function (err) {
        console.log("Email Sent Error: ", err);
        return false;
    });
};
exports.sendEmail = sendEmail;
