"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../infrastructure/database/sequelize");
class Session extends sequelize_1.Model {
    toJSON() {
        const values = Object.assign({}, this.get());
        delete values.refreshTokenHash;
        return values;
    }
}
exports.Session = Session;
Session.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    unique_id: { type: sequelize_1.DataTypes.STRING, unique: true, allowNull: true },
    userId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    refreshTokenHash: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    deviceId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    deviceName: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    platform: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    ipAddress: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    userAgent: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    lastActiveAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    expiresAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    revokedAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, {
    sequelize: sequelize_2.sequelize,
    tableName: 'sessions',
    timestamps: true,
    updatedAt: false,
});
Session.beforeValidate(async (session) => {
    if (!session.isNewRecord || session.unique_id)
        return;
    const lastRecord = await Session.findOne({
        order: [['unique_id', 'DESC']],
    });
    let nextId = 1;
    if (lastRecord && lastRecord.unique_id) {
        const parts = lastRecord.unique_id.split('-');
        if (parts.length === 2) {
            nextId = parseInt(parts[1], 10) + 1;
        }
    }
    session.unique_id = `S-${nextId.toString().padStart(7, '0')}`;
});
