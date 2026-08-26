"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./auth.route"));
const conversation_route_1 = __importDefault(require("./conversation.route"));
const user_route_1 = __importDefault(require("./user.route"));
const lookup_route_1 = __importDefault(require("./lookup.route"));
const router = (0, express_1.Router)();
router.use('/user', auth_route_1.default);
router.use('/user', user_route_1.default);
router.use('/user/conversations', conversation_route_1.default);
router.use('/user/lookups', lookup_route_1.default);
exports.default = router;
