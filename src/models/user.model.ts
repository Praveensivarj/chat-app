import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../infrastructure/database/sequelize';

export class User extends Model {
    declare id: string;
    declare unique_id: string;
    declare email: string;
    declare passwordHash: string;
    declare api_key: string | null;
    declare salt_key: string | null;
    declare access_token: string | null;
    declare private_key: string | null;
    declare publick_key: string | null;
    declare email_otp: string | null;
    declare email_otp_expiry: Date | null;
    declare timezone: string | null;
    declare gender: string | null;
    declare mobile: string | null;
    declare mobile_country_code: string | null;
    declare status: string;

    declare email_verified_at: Date | null;
    declare readonly created_at: Date;
    declare readonly updated_at: Date;
    declare readonly deleted_at: Date | null;

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

User.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        unique_id: { type: DataTypes.STRING, unique: true, allowNull: true },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        api_key: { type: DataTypes.STRING, allowNull: true },
        salt_key: { type: DataTypes.STRING, allowNull: true },
        access_token: { type: DataTypes.STRING(2048), allowNull: true },
        private_key: { type: DataTypes.TEXT, allowNull: true },
        publick_key: { type: DataTypes.TEXT, allowNull: true },
        email_otp: { type: DataTypes.STRING, allowNull: true },
        email_otp_expiry: { type: DataTypes.DATE, allowNull: true },
        timezone: { type: DataTypes.STRING, allowNull: true },
        gender: { type: DataTypes.STRING, allowNull: true },
        mobile: { type: DataTypes.STRING, allowNull: true },
        mobile_country_code: { type: DataTypes.STRING, allowNull: true },
        status: { type: DataTypes.STRING, defaultValue: 'active' },
        email_verified_at: { type: DataTypes.DATE, allowNull: true },
        created_at: { type: DataTypes.DATE, allowNull: false },
        updated_at: { type: DataTypes.DATE, allowNull: false },
        deleted_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    },
);

User.beforeValidate(async (user) => {
    if (!user.isNewRecord || user.unique_id) return;
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
