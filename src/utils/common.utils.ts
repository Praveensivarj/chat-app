import { randomBytes, generateKeyPairSync, createHash, randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import moment from 'moment-timezone';

/**
 * Generates a random alphanumeric string of a specific length.
 */
export const randomString = (length: number = 10): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomBuffer = randomBytes(length);
    for (let i = 0; i < length; i++) {
        result += chars[randomBuffer[i] % chars.length];
    }
    return result;
};

/**
 * Generates a random numeric string of a specific length.
 */
export const randomNumber = (length: number = 6): string => {
    const chars = '0123456789';
    let result = '';
    const randomBuffer = randomBytes(length);
    for (let i = 0; i < length; i++) {
        result += chars[randomBuffer[i] % chars.length];
    }
    return result;
};

export const generateRsaKeyPair = (): { publicKey: string; privateKey: string } => {
    return generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
};

export const generateApiKey = (): string => {
    return randomBytes(40).toString('base64url');
};

export const generateSaltKey = (): string => {
    return randomBytes(8).toString('hex');
};

export const generateAccessToken = (): {
    plaintextToken: string;
    tokenFingerprint: string;
} => {
    const plaintextToken = randomBytes(40).toString('hex');
    const tokenFingerprint = createHash('sha256').update(plaintextToken).digest('hex');
    return { plaintextToken, tokenFingerprint };
};

export const generateUniqueId = (): string => {
    return randomUUID();
};

/**
 * Builds the flag asset URL for a country code (alpha-2 or alpha-3).
 */
export const getFlagUrl = (countryCode: string | null | undefined): string => {
    if (!countryCode) {
        return "";
    }
    
    // Default to localhost if process.env.APP_URL is not set
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    
    // In our mobile country codes table, we have alpha2Code, so countryCode
    // passed here should just be that alpha2Code.
    const code = countryCode.toLowerCase();
    
    return `${baseUrl.replace(/\/$/, "")}/images/countries/${code}.png`;
};

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash.replace(/^\$2[ab]\$/, "$2y$");
};

export const comparePassword = async (
    password: string,
    storedHash: string,
): Promise<boolean> => {
    if (!storedHash) {
        return false;
    }
    try {
        const normalizedHash = storedHash.replace(/^\$2y\$/, "$2a$");
        return await bcrypt.compare(password, normalizedHash);
    } catch {
        return false;
    }
};

export const verifyAndUpgradePassword = async (
    storedHash: string,
    password: string,
): Promise<{ valid: boolean; rehash?: string }> => {
    const valid = await comparePassword(password, storedHash);
    if (valid && !storedHash.startsWith("$2y$")) {
        return { valid, rehash: await hashPassword(password) };
    }
    return { valid };
};

export const formatDate = (
    date: Date | string | null | undefined,
    timezone = "UTC",
): string => {
    if (!date) {
        return "";
    }
    let resolvedTimezone = timezone;
    if (resolvedTimezone?.includes("Calcutta")) {
        resolvedTimezone = "Asia/Kolkata";
    }
    return moment.utc(date).tz(resolvedTimezone).format("D MMM YYYY h:mm A");
};

export const generateEmailCodeExpiry = (minutesAhead = 10): string => {
    return new Date(Date.now() + minutesAhead * 60_000).toISOString();
};

export const formatDateHuman = (
    date: Date | string | null | undefined,
    timezone = "Asia/Kolkata",
): string => {
    if (!date) {
        return "";
    }
    return moment.utc(date).tz(timezone).format("DD MMM YYYY hh:mm A");
};

export const genderFormatted = (gender: string | null | undefined): string => {
    if (!gender) {
        return "";
    }
    const normalizedGender = gender.toLowerCase().trim();
    if (["male", "1", "m"].includes(normalizedGender)) {
        return "Male";
    }
    if (["female", "2", "f"].includes(normalizedGender)) {
        return "Female";
    }
    if (["others", "3", "o"].includes(normalizedGender)) {
        return "Others";
    }
    return gender;
};
