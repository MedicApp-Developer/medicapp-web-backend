"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var apis_1 = __importDefault(require("../../controllers/lookups/apis"));
var router = express_1.default.Router();
router.get('/countries', apis_1.default.getCountries);
router.get('/genders', apis_1.default.getGenders);
router.get('/languages', apis_1.default.getLanguages);
module.exports = router;
