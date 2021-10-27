"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var services_1 = __importDefault(require("../../controllers/hospitals/services"));
var extractJWT_1 = __importDefault(require("../../middleware/extractJWT"));
var router = express_1.default.Router();
router.get('/all', services_1.default.getAllServices);
router.get('/:id', extractJWT_1.default, services_1.default.getSingleService);
router.post('/', services_1.default.createService);
router.put('/:id', extractJWT_1.default, services_1.default.updateService);
router.delete('/:id', extractJWT_1.default, services_1.default.deleteService);
module.exports = router;
