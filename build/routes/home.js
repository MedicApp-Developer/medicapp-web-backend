"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var home_1 = __importDefault(require("../controllers/home"));
var extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
var router = express_1.default.Router();
router.post('/', extractJWT_1.default, home_1.default.getHomeData);
router.get('/filters', home_1.default.getFilters);
module.exports = router;
