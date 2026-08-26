"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genderFormatted = exports.formatDateHuman = exports.generateEmailCodeExpiry = exports.formatDate = exports.verifyAndUpgradePassword = exports.comparePassword = exports.hashPassword = exports.getFlagUrl = exports.generateUniqueId = exports.generateAccessToken = exports.generateSaltKey = exports.generateApiKey = exports.generateRsaKeyPair = exports.randomNumber = exports.randomString = void 0;
const crypto_1 = require("crypto");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/**
 * Generates a random alphanumeric string of a specific length.
 */
const randomString = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomBuffer = (0, crypto_1.randomBytes)(length);
    for (let i = 0; i < length; i++) {
        result += chars[randomBuffer[i] % chars.length];
    }
    return result;
};
exports.randomString = randomString;
/**
 * Generates a random numeric string of a specific length.
 */
const randomNumber = (length = 6) => {
    const chars = '0123456789';
    let result = '';
    const randomBuffer = (0, crypto_1.randomBytes)(length);
    for (let i = 0; i < length; i++) {
        result += chars[randomBuffer[i] % chars.length];
    }
    return result;
};
exports.randomNumber = randomNumber;
const generateRsaKeyPair = () => {
    return (0, crypto_1.generateKeyPairSync)('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
};
exports.generateRsaKeyPair = generateRsaKeyPair;
const generateApiKey = () => {
    return (0, crypto_1.randomBytes)(40).toString('base64url');
};
exports.generateApiKey = generateApiKey;
const generateSaltKey = () => {
    return (0, crypto_1.randomBytes)(8).toString('hex');
};
exports.generateSaltKey = generateSaltKey;
const generateAccessToken = () => {
    const plaintextToken = (0, crypto_1.randomBytes)(40).toString('hex');
    const tokenFingerprint = (0, crypto_1.createHash)('sha256').update(plaintextToken).digest('hex');
    return { plaintextToken, tokenFingerprint };
};
exports.generateAccessToken = generateAccessToken;
const generateUniqueId = () => {
    return (0, crypto_1.randomUUID)();
};
exports.generateUniqueId = generateUniqueId;
/**
 * Builds the flag asset URL for a country code (alpha-2 or alpha-3).
 */
const getFlagUrl = (countryCode) => {
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
exports.getFlagUrl = getFlagUrl;
const hashPassword = async (password) => {
    const salt = await bcryptjs_1.default.genSalt(10);
    const hash = await bcryptjs_1.default.hash(password, salt);
    return hash.replace(/^\$2[ab]\$/, "$2y$");
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, storedHash) => {
    if (!storedHash) {
        return false;
    }
    try {
        const normalizedHash = storedHash.replace(/^\$2y\$/, "$2a$");
        return await bcryptjs_1.default.compare(password, normalizedHash);
    }
    catch {
        return false;
    }
};
exports.comparePassword = comparePassword;
const verifyAndUpgradePassword = async (storedHash, password) => {
    const valid = await (0, exports.comparePassword)(password, storedHash);
    if (valid && !storedHash.startsWith("$2y$")) {
        return { valid, rehash: await (0, exports.hashPassword)(password) };
    }
    return { valid };
};
exports.verifyAndUpgradePassword = verifyAndUpgradePassword;
const formatDate = (date, timezone = "UTC") => {
    if (!date) {
        return "";
    }
    let resolvedTimezone = timezone;
    if (resolvedTimezone?.includes("Calcutta")) {
        resolvedTimezone = "Asia/Kolkata";
    }
    return moment_timezone_1.default.utc(date).tz(resolvedTimezone).format("D MMM YYYY h:mm A");
};
exports.formatDate = formatDate;
const generateEmailCodeExpiry = (minutesAhead = 10) => {
    return new Date(Date.now() + minutesAhead * 60_000).toISOString();
};
exports.generateEmailCodeExpiry = generateEmailCodeExpiry;
const formatDateHuman = (date, timezone = "Asia/Kolkata") => {
    if (!date) {
        return "";
    }
    return moment_timezone_1.default.utc(date).tz(timezone).format("DD MMM YYYY hh:mm A");
};
exports.formatDateHuman = formatDateHuman;
const genderFormatted = (gender) => {
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
exports.genderFormatted = genderFormatted;
