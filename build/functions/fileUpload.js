"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer = require("multer");
var path_1 = __importDefault(require("path"));
var fileStorageEngine = multer.diskStorage({
    destination: './source/images',
    filename: function (req, file, cb) {
        cb(null, path_1.default.basename(file.originalname, path_1.default.extname(file.originalname)) +
            "-" +
            Date.now() +
            path_1.default.extname(file.originalname));
    }
});
var upload = multer({ storage: fileStorageEngine });
exports.default = upload;
// **** For Reference **** //
// Single File Upload
// router.post("/single", upload.single("image"), (req, res) => {
//     console.log(req.file);
//     res.send("Single file Uploaded Successfully");
// });
// // Multiple File Upload
// router.post('/multiple', upload.array('images', 3),(req, res) => {
//     console.log(req.files);
//     res.send("Multiple files Uploaded Successfully");
// })
