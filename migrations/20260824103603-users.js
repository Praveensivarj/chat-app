'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      passwordHash: { type: Sequelize.STRING, allowNull: false },
      api_key: { type: Sequelize.STRING },
      salt_key: { type: Sequelize.STRING },
      access_token: { type: Sequelize.STRING(2048) },
      private_key: { type: Sequelize.TEXT },
      publick_key: { type: Sequelize.TEXT },
      email_otp: { type: Sequelize.STRING },
      email_otp_expiry: { type: Sequelize.DATE },
      timezone: { type: Sequelize.STRING },
      gender: { type: Sequelize.STRING },
      mobile: { type: Sequelize.STRING },
      mobile_country_code: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING, defaultValue: 'active' },
      email_verified_at: { type: Sequelize.DATE },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE }
    });
    
    // session, conversations, conversation_members, messages
    await queryInterface.createTable('sessions', {
      id: { type: Sequelize.UUID, primaryKey: true },
      userId: { type: Sequelize.UUID, allowNull: false },
      refreshTokenHash: { type: Sequelize.STRING, allowNull: false },
      deviceId: { type: Sequelize.STRING, allowNull: false },
      deviceName: { type: Sequelize.STRING },
      platform: { type: Sequelize.STRING },
      ipAddress: { type: Sequelize.STRING },
      userAgent: { type: Sequelize.STRING },
      lastActiveAt: { type: Sequelize.DATE, allowNull: false },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      revokedAt: { type: Sequelize.DATE },
      createdAt: { type: Sequelize.DATE, allowNull: false }
    });
    
    await queryInterface.createTable('conversations', {
      id: { type: Sequelize.UUID, primaryKey: true },
      isGroup: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('conversation_members', {
      id: { type: Sequelize.UUID, primaryKey: true },
      conversationId: { type: Sequelize.UUID, allowNull: false },
      userId: { type: Sequelize.UUID, allowNull: false },
      role: { type: Sequelize.STRING, defaultValue: 'MEMBER' },
      createdAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('messages', {
      id: { type: Sequelize.UUID, primaryKey: true },
      conversationId: { type: Sequelize.UUID, allowNull: false },
      senderId: { type: Sequelize.UUID, allowNull: false },
      messageType: { type: Sequelize.STRING, allowNull: false, defaultValue: 'TEXT' },
      content: { type: Sequelize.TEXT, allowNull: false },
      replyToMessageId: { type: Sequelize.UUID },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      editedAt: { type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('messages');
    await queryInterface.dropTable('conversation_members');
    await queryInterface.dropTable('conversations');
    await queryInterface.dropTable('sessions');
    await queryInterface.dropTable('users');
  }
};