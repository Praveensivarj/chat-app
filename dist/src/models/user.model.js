"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../infrastructure/database/sequelize");
class User extends sequelize_1.Model {
    toJSON() {
        const values = Object.assign({}, this.get());
        delete values.passwordHash;
        delete values.api_key;
        delete values.salt_key;
        delete values.access_token;
        delete values.private_key;
        delete values.publick_key;
        delete values.email_otp;
        delete values.email_otp_expiry;
        delete values.deleted_at;
        return values;
    }
}
exports.User = User;
User.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    unique_id: { type: sequelize_1.DataTypes.STRING, unique: true, allowNull: true },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    passwordHash: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    api_key: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    salt_key: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    access_token: { type: sequelize_1.DataTypes.STRING(2048), allowNull: true },
    private_key: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    publick_key: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    email_otp: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    email_otp_expiry: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    timezone: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    gender: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    mobile: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    mobile_country_code: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    status: { type: sequelize_1.DataTypes.STRING, defaultValue: 'active' },
    email_verified_at: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    created_at: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    updated_at: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    deleted_at: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, {
    sequelize: sequelize_2.sequelize,
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
});
User.beforeValidate(async (user) => {
    if (!user.isNewRecord || user.unique_id)
        return;
    const lastRecord = await User.findOne({
        order: [['unique_id', 'DESC']],
        paranoid: false,
    });
    let nextId = 1;
    if (lastRecord && lastRecord.unique_id) {
        const parts = lastRecord.unique_id.split('-');
        if (parts.length === 2) {
            nextId = parseInt(parts[1], 10) + 1;
        }
    }
    user.unique_id = `U-${nextId.toString().padStart(7, '0')}`;
});
