import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../infrastructure/database/sequelize';

export class MobileCountryCode extends Model {
    declare id: string;
    declare unique_id: string;
    declare countryName: string;
    declare isdCode: string;
    declare alpha2Code: string;
    declare alpha3Code: string;
    declare status: number;
    declare readonly createdAt: Date | null;
    declare readonly updatedAt: Date | null;
}

MobileCountryCode.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        unique_id: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        countryName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        isdCode: {
            type: DataTypes.STRING(8),
            allowNull: false,
        },
        alpha2Code: {
            field: 'alpha_2_code',
            type: DataTypes.STRING(5),
            allowNull: false,
        },
        alpha3Code: {
            field: 'alpha_3_code',
            type: DataTypes.STRING(5),
            allowNull: false,
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1,
        },
    },
    {
        sequelize,
        tableName: 'mobile_country_codes',
        underscored: true,
        timestamps: true,
    },
);

MobileCountryCode.beforeValidate(async (record) => {
    if (!record.isNewRecord || record.unique_id) return;
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
