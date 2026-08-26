'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sessions', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      refreshTokenHash: { type: Sequelize.STRING, allowNull: false },
      deviceId: { type: Sequelize.STRING, allowNull: false },
      deviceName: { type: Sequelize.STRING, allowNull: true },
      platform: { type: Sequelize.STRING, allowNull: true },
      ipAddress: { type: Sequelize.STRING, allowNull: true },
      userAgent: { type: Sequelize.STRING, allowNull: true },
      lastActiveAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      revokedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('sessions');
  }
};
