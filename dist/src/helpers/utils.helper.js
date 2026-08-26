"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlagUrl = void 0;
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
