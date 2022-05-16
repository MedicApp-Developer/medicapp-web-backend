"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var leaves_1 = __importDefault(require("../controllers/leaves"));
var extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
var router = express_1.default.Router();
router.post('/', extractJWT_1.default, leaves_1.default.createLeave);
router.get('/getSickLeaves/:id', extractJWT_1.default, leaves_1.default.getSickLeaves);
router.get('/downloadSickLeave/:id', extractJWT_1.default, leaves_1.default.downloadSickLeave);
module.exports = router;
