import { Session } from '../models/session.model';

export const sessionToJSON = (session: Session | null): Record<string, unknown> | null => {
    if (!session) return null;

    return {
        unique_id: session.unique_id,
        device_id: session.deviceId,
        device_name: session.deviceName ?? '',
        platform: session.platform ?? '',
        ip_address: session.ipAddress ?? '',
        user_agent: session.userAgent ?? '',
        last_active_at: session.lastActiveAt,
        expires_at: session.expiresAt,
    };
};
