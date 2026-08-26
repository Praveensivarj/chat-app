"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationService = void 0;
const socket_server_1 = require("../sockets/socket.server");
const models_1 = require("../models");
const app_error_1 = require("../errors/app.error");
const sequelize_1 = require("../infrastructure/database/sequelize");
const sequelize_2 = require("sequelize");
class ConversationService {
    async createDirect(currentUserId, targetUserId) {
        if (currentUserId === targetUserId)
            throw new app_error_1.AppError(1009, 400);
        const target = await models_1.User.findByPk(targetUserId);
        if (!target)
            throw new app_error_1.AppError(1011, 404);
        return sequelize_1.sequelize.transaction(async (t) => {
            const conv = await models_1.Conversation.create({ isGroup: false }, { transaction: t });
            await models_1.ConversationMember.create({ conversationId: conv.id, userId: currentUserId, role: 'MEMBER' }, { transaction: t });
            await models_1.ConversationMember.create({ conversationId: conv.id, userId: targetUserId, role: 'MEMBER' }, { transaction: t });
            return conv;
        });
    }
    async createGroup(currentUserId, name, userIds) {
        return sequelize_1.sequelize.transaction(async (t) => {
            const conv = await models_1.Conversation.create({ isGroup: true }, { transaction: t });
            await models_1.ConversationMember.create({ conversationId: conv.id, userId: currentUserId, role: 'ADMIN' }, { transaction: t });
            for (const id of userIds) {
                if (id !== currentUserId) {
                    const u = await models_1.User.findByPk(id);
                    if (u) {
                        await models_1.ConversationMember.create({ conversationId: conv.id, userId: id, role: 'MEMBER' }, { transaction: t });
                    }
                }
            }
            return conv;
        });
    }
    async sendMessage(userId, conversationId, data) {
        const member = await models_1.ConversationMember.findOne({ where: { conversationId, userId } });
        if (!member)
            throw new app_error_1.AppError(1007, 403);
        const msg = await models_1.Message.create({
            conversationId,
            senderId: userId,
            content: data.content,
            messageType: data.messageType,
            replyToMessageId: data.replyToMessageId || null,
        });
        if (socket_server_1.io) {
            socket_server_1.io.to(`conversation:${conversationId}`).emit('message:new', msg);
        }
        return msg;
    }
    async getMessages(userId, conversationId, query) {
        const member = await models_1.ConversationMember.findOne({ where: { conversationId, userId } });
        if (!member)
            throw new app_error_1.AppError(1007, 403);
        const where = { conversationId };
        if (query.cursor) {
            where.createdAt = { [sequelize_2.Op.lt]: query.cursor };
        }
        const messages = await models_1.Message.findAll({
            where,
            limit: query.limit || 50,
            order: [['createdAt', 'DESC']],
        });
        return messages;
    }
}
exports.ConversationService = ConversationService;
