"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = makeResponse;
