'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('messages', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      conversationId: { type: Sequelize.UUID, allowNull: false, references: { model: 'conversations', key: 'id' }, onDelete: 'CASCADE' },
      senderId: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      messageType: { type: Sequelize.STRING, allowNull: false, defaultValue: 'TEXT' },
      content: { type: Sequelize.TEXT, allowNull: false },
      replyToMessageId: { type: Sequelize.UUID, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      editedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('messages');
  }
};
