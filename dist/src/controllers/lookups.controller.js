"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countries = exports.mobileCountryCodes = void 0;
const mobile_country_code_model_1 = require("../models/mobile_country_code.model");
const common_utils_1 = require("../utils/common.utils");
const mobileCountryCodes = async (_req, res) => {
    try {
        const countryCodeRows = await mobile_country_code_model_1.MobileCountryCode.findAll({
            where: { status: 1 },
            order: [['countryName', 'ASC']],
        });
        const mobile_country_codes = countryCodeRows.map((countryCodeRow) => ({
            label: countryCodeRow.alpha2Code,
            value: countryCodeRow.isdCode,
            country_name: countryCodeRow.countryName,
            flag: (0, common_utils_1.getFlagUrl)(countryCodeRow.alpha2Code),
        }));
        return res.sendResponse(200, { mobile_country_codes });
    }
    catch (error) {
        console.error('Lookups Error (mobileCountryCodes):', error);
        return res.sendError(500);
    }
};
exports.mobileCountryCodes = mobileCountryCodes;
const countries = async (_req, res) => {
    try {
        const countryCodeRows = await mobile_country_code_model_1.MobileCountryCode.findAll({
            where: { status: 1 },
            order: [['countryName', 'ASC']],
        });
        const countriesData = countryCodeRows.map((countryCodeRow) => ({
            label: countryCodeRow.countryName,
            value: countryCodeRow.alpha3Code,
            flag: (0, common_utils_1.getFlagUrl)(countryCodeRow.alpha2Code),
        }));
        return res.sendResponse(200, { countries: countriesData });
    }
    catch (error) {
        console.error('Lookups Error (countries):', error);
        return res.sendError(500);
    }
};
exports.countries = countries;
