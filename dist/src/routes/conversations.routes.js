"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const conversations_controller_1 = require("../controllers/conversations.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const conversation_validator_1 = require("../validators/conversation.validator");
const auth_middleware_1 = require("../middleware/auth.middleware");
const signature_middleware_1 = require("../middleware/signature.middleware");
const router = (0, express_1.Router)();
const controller = new conversations_controller_1.ConversationController();
router.use(auth_middleware_1.authMiddleware, signature_middleware_1.signatureMiddleware);
router.post('/direct', (0, validation_middleware_1.validate)(conversation_validator_1.conversationValidator.createDirect), controller.createDirect);
router.post('/group', (0, validation_middleware_1.validate)(conversation_validator_1.conversationValidator.createGroup), controller.createGroup);
router.post('/:id/messages', (0, validation_middleware_1.validate)(conversation_validator_1.conversationValidator.sendMessage), controller.sendMessage);
const app_error_1 = require("../errors/app.error");
const validateQuery = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.query, { stripUnknown: false });
    if (error)
        return next(new app_error_1.AppError(1001, 400));
    req.query = value;
    next();
};
router.get('/:id/messages', validateQuery(conversation_validator_1.conversationValidator.getMessages), controller.getMessages);
exports.default = router;
