"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAge = void 0;
var moment_1 = __importDefault(require("moment"));
function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
exports.getAge = getAge;
var generateSickLeaveDocument = function (leave) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    console.log("leave => ", leave);
    var todayDate = (0, moment_1.default)(new Date()).format("YYYY/MM/DD");
    var fromDate = (0, moment_1.default)(leave === null || leave === void 0 ? void 0 : leave.from).format("YYYY/MM/DD");
    var toDate = (0, moment_1.default)(leave === null || leave === void 0 ? void 0 : leave.to).format("YYYY/MM/DD");
    return "\n\t\t<!DOCTYPE html>\n\t\t<html>\n\t\t<head>\n\t\t\t<meta charset=\"utf-8\">\n\t\t\t<title>Sick Leave Approval</title>\n\t\t\t<style>\n\t\t\t.container {\n\t\t\t\tpadding: 2rem;\n\t\t\t}\n\t\t\t\n\t\t\t.underline {\n\t\t\t\ttext-decoration: underline;\n\t\t\t}\n\t\t\t\n\t\t\t.center {\n\t\t\t\ttext-align: center\n\t\t\t}\n\t\t\t\n\t\t\t.contact-box {\n\t\t\t\tpadding-left: 1.5rem;\n\t\t\t\tborder: 1px solid gray;\n\t\t\t\twidth: 20rem;\n\t\t\t\tborder-radius: 1rem\n\t\t\t}\n\t\t\t\n\t\t\t.bold {\n\t\t\t\t font-weight: bold\n\t\t\t}\n\t\t\t\n\t\t\t.space { \n\t\t\t\t margin: 0.5rem\n\t\t\t}\n\t\t\t\n\t\t\t.heading: {\n\t\t\t\tmargin-top: 1rem;\n\t\t\t\tmargin-bottom: 1rem;\n\t\t\t}\n\t\t\t\n\t\t\t.imageContainer {\n\t\t\t\ttext-align: center;\n\t\t\t\tmargin-top: 1rem;\n\t\t\t\tmargin-bottom: 1rem;\n\t\t\t}\n\t\t\t\n\t\t\t.signature {\n\t\t\t\tfloat: right;\n\t\t\t}\n\t\t\t\n\t\t\t.underline-signature {\n\t\t\t\tdisplay: inline-block;\n\t\t\t\t\t\t\t\tpadding-right: 1rem;\n\t\t\t\t\t\t\t\tpadding-left: 1rem;\n\t\t\t\t\t\t\t\tborder-bottom: 1px solid #888;\n\t\t\t}\n\t\t\t\n\t\t\t.disclaimer {\n\t\t\t\ttext-align: center;\n\t\t\t\tfont-style: italic;\n\t\t\t\tfont-size: 0.7rem;\n\t\t\t}\n\t\t\t</style>\n\t\t</head>\n\t\t\t<body>\n\t\t\t\n\t\t\t<div class=\"container\">\n  \n  <div class=\"contact-box\">\n    <p> <span class=\"underline bold space\">Name:</span> ".concat(((_a = leave === null || leave === void 0 ? void 0 : leave.patientId) === null || _a === void 0 ? void 0 : _a.firstName) + " " + ((_b = leave === null || leave === void 0 ? void 0 : leave.patientId) === null || _b === void 0 ? void 0 : _b.lastName), " </p>\n    <p><span class=\"underline bold space\">ID:</span> ").concat((_c = leave === null || leave === void 0 ? void 0 : leave.patientId) === null || _c === void 0 ? void 0 : _c.emiratesId, "</p>\n    <p><span class=\"underline bold space\">Gender:</span> ").concat((_d = leave === null || leave === void 0 ? void 0 : leave.patientId) === null || _d === void 0 ? void 0 : _d.gender, "</p>\n    <p><span class=\"underline bold space\">Age:</span> ").concat(getAge(leave === null || leave === void 0 ? void 0 : leave.patientId.birthday), "</p>\n    <p><span class=\"underline bold space\">Contact: </span> ").concat((_e = leave === null || leave === void 0 ? void 0 : leave.patientId) === null || _e === void 0 ? void 0 : _e.phone, "</p>\n  </div>\n  \n  <h1 class=\"underline center heading\">Sick Leave</h1>\n  <p>Doctor's diagnose and remarks: ").concat(leave === null || leave === void 0 ? void 0 : leave.description, "</p>\n  <p>From: ").concat(fromDate, "</p>\n  <p>To: ").concat(toDate, "</p>\n  <div class=\"imageContainer\">\n      <img src=\"https://res.cloudinary.com/dsimhetcs/image/upload/v1642879618/jvk6lifa3ixqulihbdci.png\" class=\"image\" />\n  </div>\n  \n  <div class=\"signature\">\n    <p> <span class=\"bold space\">Doctor:</span> <span class=\"underline-signature\">").concat(((_f = leave === null || leave === void 0 ? void 0 : leave.doctorId) === null || _f === void 0 ? void 0 : _f.firstName) + " " + ((_g = leave === null || leave === void 0 ? void 0 : leave.doctorId) === null || _g === void 0 ? void 0 : _g.lastName), "</span></p>\n    <p><span class=\"bold space\">Hospital:</span> <span class=\"underline-signature\">").concat((_j = (_h = leave === null || leave === void 0 ? void 0 : leave.doctorId) === null || _h === void 0 ? void 0 : _h.hospitalId) === null || _j === void 0 ? void 0 : _j.name, "</span></p>\n    <p><span class=\"bold space\">Signature:</span> <span class=\"underline-signature\">").concat(((_k = leave === null || leave === void 0 ? void 0 : leave.doctorId) === null || _k === void 0 ? void 0 : _k.firstName) + " " + ((_l = leave === null || leave === void 0 ? void 0 : leave.doctorId) === null || _l === void 0 ? void 0 : _l.lastName), "<span/></p>\n  </div>\n  <br/>\n  <br/>\n  <br/>\n  <br/>\n  <br/>\n  <br/>\n  <br/>\n  <br/>\n  <br/>\n  \n  <div class=\"disclaimer\">\n    <p>*Disclaimer: MedicApp L.L.C will not be responsible of how this document is used</p>\n  </div>\n  \n  <p class=\"underline-signature\"> Date Issued: ").concat(todayDate, " </p>\n</div>\n\n\t\t\t</body>\n\t\t</html>\n\t");
};
exports.default = generateSickLeaveDocument;
