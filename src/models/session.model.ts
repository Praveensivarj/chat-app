import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../infrastructure/database/sequelize';

export class Session extends Model {
    declare id: string;
    declare unique_id: string;
    declare userId: string;
    declare refreshTokenHash: string;
    declare deviceId: string;
    declare deviceName: string | null;
    declare platform: string | null;
    declare ipAddress: string | null;
    declare userAgent: string | null;
    declare lastActiveAt: Date;
    declare readonly createdAt: Date;
    declare expiresAt: Date;
    declare revokedAt: Date | null;

    toJSON() {
        const values = Object.assign({}, this.get());
        delete values.refreshTokenHash;
        return values;
    }
}

Session.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        unique_id: { type: DataTypes.STRING, unique: true, allowNull: true },
        userId: { type: DataTypes.UUID, allowNull: false },
        refreshTokenHash: { type: DataTypes.STRING, allowNull: false },
        deviceId: { type: DataTypes.STRING, allowNull: false },
        deviceName: { type: DataTypes.STRING, allowNull: true },
        platform: { type: DataTypes.STRING, allowNull: true },
        ipAddress: { type: DataTypes.STRING, allowNull: true },
        userAgent: { type: DataTypes.STRING, allowNull: true },
        lastActiveAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        expiresAt: { type: DataTypes.DATE, allowNull: false },
        revokedAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
        sequelize,
        tableName: 'sessions',
        timestamps: true,
        updatedAt: false,
    },
);

Session.beforeValidate(async (session) => {
    if (!session.isNewRecord || session.unique_id) return;
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
