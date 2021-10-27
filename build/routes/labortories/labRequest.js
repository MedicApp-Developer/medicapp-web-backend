"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var labRequest_1 = __importDefault(require("../../controllers/labortories/labRequest"));
var extractJWT_1 = __importDefault(require("../../middleware/extractJWT"));
var router = express_1.default.Router();
router.post('/', extractJWT_1.default, labRequest_1.default.createLabRequest);
router.get('/:doctorId', extractJWT_1.default, labRequest_1.default.getLabRequests);
router.put('/:labRequest', extractJWT_1.default, labRequest_1.default.updateLabRequest);
module.exports = router;
