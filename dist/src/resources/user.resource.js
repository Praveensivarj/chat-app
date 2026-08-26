"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authTokensToJSON = exports.shapeCredentials = exports.shapeLoginUser = void 0;
const common_utils_1 = require("../utils/common.utils");
const shapeLoginUser = (user) => {
    return {
        unique_id: user.unique_id,
        email: user.email,
        timezone: user.timezone ?? '',
        gender: (0, common_utils_1.genderFormatted)(user.gender),
        mobile: user.mobile ?? '',
        mobile_country_code: user.mobile_country_code ?? '',
        flag_url: (0, common_utils_1.getFlagUrl)(user.mobile_country_code),
        status: user.status,
        email_status: user.email_verified_at ? 'VERIFIED' : 'NOT_VERIFIED',
    };
};
exports.shapeLoginUser = shapeLoginUser;
const shapeCredentials = (user) => {
    return {
        unique_id: user.unique_id,
        api_key: user.api_key ?? '',
        salt_key: user.salt_key ?? '',
        private_key: user.private_key ?? '',
    };
};
exports.shapeCredentials = shapeCredentials;
const authTokensToJSON = (user, accessToken, refreshToken) => {
    const response = {
        access_token: accessToken,
        refresh_token: refreshToken,
    };
    if (user) {
        response.user = (0, exports.shapeLoginUser)(user);
    }
    return response;
};
exports.authTokensToJSON = authTokensToJSON;
