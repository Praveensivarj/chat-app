import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../infrastructure/database/sequelize';

export class Conversation extends Model {
    declare id: string;
    declare unique_id: string;
    declare isGroup: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Conversation.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        unique_id: { type: DataTypes.STRING, unique: true, allowNull: true },
        isGroup: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    },
    { sequelize, tableName: 'conversations', timestamps: true },
);

Conversation.beforeValidate(async (conversation) => {
    if (!conversation.isNewRecord || conversation.unique_id) return;
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

export class ConversationMember extends Model {
    declare id: string;
    declare unique_id: string;
    declare conversationId: string;
    declare userId: string;
    declare role: string;
    declare readonly createdAt: Date;
}

ConversationMember.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        unique_id: { type: DataTypes.STRING, unique: true, allowNull: true },
        conversationId: { type: DataTypes.UUID, allowNull: false },
        userId: { type: DataTypes.UUID, allowNull: false },
        role: { type: DataTypes.STRING, defaultValue: 'MEMBER' },
    },
    { sequelize, tableName: 'conversation_members', timestamps: true, updatedAt: false },
);

ConversationMember.beforeValidate(async (member) => {
    if (!member.isNewRecord || member.unique_id) return;
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

export class Message extends Model {
    declare id: string;
    declare unique_id: string;
    declare conversationId: string;
    declare senderId: string;
    declare messageType: string;
    declare content: string;
    declare replyToMessageId: string | null;
    declare readonly createdAt: Date;
    declare editedAt: Date | null;
    declare deletedAt: Date | null;
}

Message.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        unique_id: { type: DataTypes.STRING, unique: true, allowNull: true },
        conversationId: { type: DataTypes.UUID, allowNull: false },
        senderId: { type: DataTypes.UUID, allowNull: false },
        messageType: { type: DataTypes.STRING, allowNull: false, defaultValue: 'TEXT' },
        content: { type: DataTypes.TEXT, allowNull: false },
        replyToMessageId: { type: DataTypes.UUID, allowNull: true },
        editedAt: { type: DataTypes.DATE, allowNull: true },
        deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { sequelize, tableName: 'messages', timestamps: true, updatedAt: false },
);

Message.beforeValidate(async (message) => {
    if (!message.isNewRecord || message.unique_id) return;
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
