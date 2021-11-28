"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.uploadEmirateFileId = exports.uploadsOnlyVideo = void 0;
var config_1 = __importDefault(require("../config/config"));
var multer_1 = __importDefault(require("multer"));
var multer_s3_1 = __importDefault(require("multer-s3"));
var path_1 = __importDefault(require("path"));
var aws_1 = __importDefault(require("../config/aws"));
exports.uploadsOnlyVideo = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: aws_1.default,
        // @ts-ignore
        bucket: config_1.default.bucket.name,
        acl: "public-read",
        key: function (req, file, cb) {
            cb(null, path_1.default.basename(file.originalname, path_1.default.extname(file.originalname)) +
                "-" +
                Date.now() +
                path_1.default.extname(file.originalname));
        },
    }),
    limits: { fileSize: 50000000 }, // In bytes: 2000000 bytes = 50 MB
}).single("video");
exports.uploadEmirateFileId = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: aws_1.default,
        // @ts-ignore
        bucket: config_1.default.bucket.name,
        acl: "public-read",
        key: function (req, file, cb) {
            cb(null, path_1.default.basename(file.originalname, path_1.default.extname(file.originalname)) +
                "-" +
                Date.now() +
                path_1.default.extname(file.originalname));
        },
    }),
    limits: { fileSize: 50000000 }, // In bytes: 2000000 bytes = 50 MB
}).single("emirateIdFile");
exports.uploadImage = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: aws_1.default,
        // @ts-ignore
        bucket: config_1.default.bucket.name,
        acl: "public-read",
        key: function (req, file, cb) {
            cb(null, path_1.default.basename(file.originalname, path_1.default.extname(file.originalname)) +
                "-" +
                Date.now() +
                path_1.default.extname(file.originalname));
        },
    }),
    limits: { fileSize: 50000000 }, // In bytes: 2000000 bytes = 50 MB
}).single("image");
