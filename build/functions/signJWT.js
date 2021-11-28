"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = __importDefault(require("../config/config"));
var logging_1 = __importDefault(require("../config/logging"));
var NAMESPACE = "Auth";
var signJWT = function (user, callback) {
    var timeSinceEpoch = new Date().getTime();
    var expirationTime = timeSinceEpoch + Number(config_1.default.server.token.expireTime) * 100000;
    var expirationTimeInSeconds = Math.floor(expirationTime / 1000);
    logging_1.default.info(NAMESPACE, "Attempting to sign token for ".concat(user.email));
    var payload = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        reference_id: user.referenceId
    };
    try {
        jsonwebtoken_1.default.sign(payload, 
        // @ts-ignore
        config_1.default.server.token.secret, {
            issuer: config_1.default.server.token.issuer,
            algorithm: "HS256",
            expiresIn: expirationTimeInSeconds
        }, function (error, token) {
            if (error) {
                callback(error, null);
            }
            else if (token) {
                callback(null, token);
            }
        });
    }
    catch (error) {
        logging_1.default.error(NAMESPACE, error.message, error);
        callback(error, null);
    }
};
exports.default = signJWT;
