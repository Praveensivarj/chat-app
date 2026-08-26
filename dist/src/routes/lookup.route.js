"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lookups_controller_1 = require("../controllers/lookups.controller");
const router = (0, express_1.Router)();
router.get('/mobile-country-codes', lookups_controller_1.mobileCountryCodes);
router.get('/countries', lookups_controller_1.countries);
exports.default = router;
