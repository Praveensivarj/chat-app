"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.conversationValidator = {
    createDirect: joi_1.default.object({
        userId: joi_1.default.string().uuid().required(),
    }).options({ stripUnknown: false, presence: 'required' }),
    createGroup: joi_1.default.object({
        name: joi_1.default.string().min(1).max(255).required(),
        userIds: joi_1.default.array().items(joi_1.default.string().uuid()).min(1).required(),
    }).options({ stripUnknown: false, presence: 'required' }),
    sendMessage: joi_1.default.object({
        content: joi_1.default.string().required(),
        messageType: joi_1.default.string().valid('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'FILE').required(),
        replyToMessageId: joi_1.default.string().uuid().optional(),
    }).options({ stripUnknown: false, presence: 'required' }),
    getMessages: joi_1.default.object({
        cursor: joi_1.default.string().isoDate().optional(),
        limit: joi_1.default.number().integer().min(1).max(100).default(50),
    }).options({ stripUnknown: false })
};
