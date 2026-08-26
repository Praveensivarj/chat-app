"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationController = void 0;
const conversation_service_1 = require("../services/conversation.service");
class ConversationController {
    service = new conversation_service_1.ConversationService();
    createDirect = async (req, res, next) => {
        try {
            const conv = await this.service.createDirect(req.user.userId, req.body.userId);
            return res.sendResponse(3002, conv);
        }
        catch (e) {
            next(e);
        }
    };
    createGroup = async (req, res, next) => {
        try {
            const group = await this.service.createGroup(req.user.userId, req.body.name, req.body.userIds);
            return res.sendResponse(3002, group);
        }
        catch (e) {
            next(e);
        }
    };
    sendMessage = async (req, res, next) => {
        try {
            const msg = await this.service.sendMessage(req.user.userId, req.params.id, req.body);
            return res.sendResponse(3002, msg);
        }
        catch (e) {
            next(e);
        }
    };
    getMessages = async (req, res, next) => {
        try {
            const messages = await this.service.getMessages(req.user.userId, req.params.id, req.query);
            return res.sendResponse(3001, messages);
        }
        catch (e) {
            next(e);
        }
    };
}
exports.ConversationController = ConversationController;
