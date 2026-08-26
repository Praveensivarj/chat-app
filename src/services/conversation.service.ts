import { io } from '../sockets/socket.server';
import { Conversation, ConversationMember, Message, User } from '../models';
import { AppError } from '../errors/app.error';
import { sequelize } from '../infrastructure/database/sequelize';
import { Op } from 'sequelize';

export class ConversationService {
    async createDirect(currentUserId: string, targetUserId: string) {
        if (currentUserId === targetUserId) throw new AppError(1009, 400);

        const target = await User.findByPk(targetUserId);
        if (!target) throw new AppError(1011, 404);

        return sequelize.transaction(async (t) => {
            const conv = await Conversation.create({ isGroup: false }, { transaction: t });
            await ConversationMember.create(
                { conversationId: conv.id, userId: currentUserId, role: 'MEMBER' },
                { transaction: t },
            );
            await ConversationMember.create(
                { conversationId: conv.id, userId: targetUserId, role: 'MEMBER' },
                { transaction: t },
            );
            return conv;
        });
    }

    async createGroup(currentUserId: string, name: string, userIds: string[]) {
        return sequelize.transaction(async (t) => {
            const conv = await Conversation.create({ isGroup: true }, { transaction: t });
            await ConversationMember.create(
                { conversationId: conv.id, userId: currentUserId, role: 'ADMIN' },
                { transaction: t },
            );

            for (const id of userIds) {
                if (id !== currentUserId) {
                    const u = await User.findByPk(id);
                    if (u) {
                        await ConversationMember.create(
                            { conversationId: conv.id, userId: id, role: 'MEMBER' },
                            { transaction: t },
                        );
                    }
                }
            }
            return conv;
        });
    }

    async sendMessage(userId: string, conversationId: string, data: any) {
        const member = await ConversationMember.findOne({ where: { conversationId, userId } });
        if (!member) throw new AppError(1007, 403);

        const msg = await Message.create({
            conversationId,
            senderId: userId,
            content: data.content,
            messageType: data.messageType,
            replyToMessageId: data.replyToMessageId || null,
        });

        if (io) {
            io.to(`conversation:${conversationId}`).emit('message:new', msg);
        }

        return msg;
    }

    async getMessages(userId: string, conversationId: string, query: any) {
        const member = await ConversationMember.findOne({ where: { conversationId, userId } });
        if (!member) throw new AppError(1007, 403);

        const where: any = { conversationId };
        if (query.cursor) {
            where.createdAt = { [Op.lt]: query.cursor };
        }

        const messages = await Message.findAll({
            where,
            limit: query.limit || 50,
            order: [['createdAt', 'DESC']],
        });

        return messages;
    }
}
