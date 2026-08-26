"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.ConversationMember = exports.Conversation = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../infrastructure/database/sequelize");
class Conversation extends sequelize_1.Model {
}
exports.Conversation = Conversation;
Conversation.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    unique_id: { type: sequelize_1.DataTypes.STRING, unique: true, allowNull: true },
    isGroup: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
}, { sequelize: sequelize_2.sequelize, tableName: 'conversations', timestamps: true });
Conversation.beforeValidate(async (conversation) => {
    if (!conversation.isNewRecord || conversation.unique_id)
        return;
    const lastRecord = await Conversation.findOne({
        order: [['unique_id', 'DESC']],
    });
    let nextId = 1;
    if (lastRecord && lastRecord.unique_id) {
        const parts = lastRecord.unique_id.split('-');
        if (parts.length === 2) {
            nextId = parseInt(parts[1], 10) + 1;
        }
    }
    conversation.unique_id = `C-${nextId.toString().padStart(7, '0')}`;
});
class ConversationMember extends sequelize_1.Model {
}
exports.ConversationMember = ConversationMember;
ConversationMember.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    unique_id: { type: sequelize_1.DataTypes.STRING, unique: true, allowNull: true },
    conversationId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    userId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    role: { type: sequelize_1.DataTypes.STRING, defaultValue: 'MEMBER' },
}, { sequelize: sequelize_2.sequelize, tableName: 'conversation_members', timestamps: true, updatedAt: false });
ConversationMember.beforeValidate(async (member) => {
    if (!member.isNewRecord || member.unique_id)
        return;
    const lastRecord = await ConversationMember.findOne({
        order: [['unique_id', 'DESC']],
    });
    let nextId = 1;
    if (lastRecord && lastRecord.unique_id) {
        const parts = lastRecord.unique_id.split('-');
        if (parts.length === 2) {
            nextId = parseInt(parts[1], 10) + 1;
        }
    }
    member.unique_id = `CM-${nextId.toString().padStart(7, '0')}`;
});
class Message extends sequelize_1.Model {
}
exports.Message = Message;
Message.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    unique_id: { type: sequelize_1.DataTypes.STRING, unique: true, allowNull: true },
    conversationId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    senderId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    messageType: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: 'TEXT' },
    content: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    replyToMessageId: { type: sequelize_1.DataTypes.UUID, allowNull: true },
    editedAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    deletedAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, { sequelize: sequelize_2.sequelize, tableName: 'messages', timestamps: true, updatedAt: false });
Message.beforeValidate(async (message) => {
    if (!message.isNewRecord || message.unique_id)
        return;
    const lastRecord = await Message.findOne({
        order: [['unique_id', 'DESC']],
    });
    let nextId = 1;
    if (lastRecord && lastRecord.unique_id) {
        const parts = lastRecord.unique_id.split('-');
        if (parts.length === 2) {
            nextId = parseInt(parts[1], 10) + 1;
        }
    }
    message.unique_id = `M-${nextId.toString().padStart(7, '0')}`;
});
