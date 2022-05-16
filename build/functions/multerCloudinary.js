"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
exports.default = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({}),
    fileFilter: function (req, file, cb) {
        var ext = path_1.default.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".mp4" && ext !== ".pdf") {
            // @ts-ignore
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    }
});
