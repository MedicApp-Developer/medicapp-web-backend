"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = void 0;
var makeResponse = function (res, statusCode, message, data, error) {
    if (error) {
        return res
            .status(statusCode)
            .json({ statusCode: statusCode, message: message, error: error, data: data });
    }
    else {
        return res.status(statusCode).json({ statusCode: statusCode, message: message, error: error, data: data });
    }
};
var sendErrorResponse = function (res, statusCode, message, code) {
    return res.status(statusCode).json({ statusCode: statusCode, error: { code: code, message: message } });
};
exports.sendErrorResponse = sendErrorResponse;
exports.default = makeResponse;
