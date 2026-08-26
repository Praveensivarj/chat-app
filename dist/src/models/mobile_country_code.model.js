"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileCountryCode = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../infrastructure/database/sequelize");
class MobileCountryCode extends sequelize_1.Model {
}
exports.MobileCountryCode = MobileCountryCode;
MobileCountryCode.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    unique_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    countryName: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    isdCode: {
        type: sequelize_1.DataTypes.STRING(8),
        allowNull: false,
    },
    alpha2Code: {
        field: 'alpha_2_code',
        type: sequelize_1.DataTypes.STRING(5),
        allowNull: false,
    },
    alpha3Code: {
        field: 'alpha_3_code',
        type: sequelize_1.DataTypes.STRING(5),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
    },
}, {
    sequelize: sequelize_2.sequelize,
    tableName: 'mobile_country_codes',
    underscored: true,
    timestamps: true,
});
MobileCountryCode.beforeValidate(async (record) => {
    if (!record.isNewRecord || record.unique_id)
        return;
    const lastRecord = await MobileCountryCode.findOne({
        order: [['unique_id', 'DESC']],
    });
    let nextId = 1;
    if (lastRecord && lastRecord.unique_id) {
        const parts = lastRecord.unique_id.split('-');
        if (parts.length === 2) {
            nextId = parseInt(parts[1], 10) + 1;
        }
    }
    record.unique_id = `MCC-${nextId.toString().padStart(7, '0')}`;
});
