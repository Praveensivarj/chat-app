import { User } from './user.model';
import { Session } from './session.model';
import { MobileCountryCode } from './mobile_country_code.model';
import { Conversation, ConversationMember, Message } from './conversation.model';

export const setupAssociations = () => {
    User.hasMany(Session, { foreignKey: 'userId' });
    Session.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(ConversationMember, { foreignKey: 'userId' });
    ConversationMember.belongsTo(User, { foreignKey: 'userId' });

    Conversation.hasMany(ConversationMember, { foreignKey: 'conversationId' });
    ConversationMember.belongsTo(Conversation, { foreignKey: 'conversationId' });

    Conversation.hasMany(Message, { foreignKey: 'conversationId' });
    Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

    User.hasMany(Message, { foreignKey: 'senderId' });
    Message.belongsTo(User, { foreignKey: 'senderId' });
};

export { User, Session, Conversation, ConversationMember, Message, MobileCountryCode };
