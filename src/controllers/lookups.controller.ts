import { Request, Response } from 'express';
import { MobileCountryCode } from '../models/mobile_country_code.model';
import { getFlagUrl } from '../utils/common.utils';

export const mobileCountryCodes = async (
    _req: Request,
    res: Response,
): Promise<void> => {
    try {
        const countryCodeRows = await MobileCountryCode.findAll({
            where: { status: 1 },
            order: [['countryName', 'ASC']],
        });

        const mobile_country_codes = countryCodeRows.map((countryCodeRow) => ({
            label: countryCodeRow.alpha2Code,
            value: countryCodeRow.isdCode,
            country_name: countryCodeRow.countryName,
            flag: getFlagUrl(countryCodeRow.alpha2Code),
        }));

        return res.sendResponse(200, { mobile_country_codes });
    } catch (error) {
        console.error('Lookups Error (mobileCountryCodes):', error);
        return res.sendError(500);
    }
};

export const countries = async (
    _req: Request,
    res: Response,
): Promise<void> => {
    try {
        const countryCodeRows = await MobileCountryCode.findAll({
            where: { status: 1 },
            order: [['countryName', 'ASC']],
        });

        const countriesData = countryCodeRows.map((countryCodeRow) => ({
            label: countryCodeRow.countryName,
            value: countryCodeRow.alpha3Code,
            flag: getFlagUrl(countryCodeRow.alpha2Code),
        }));

        return res.sendResponse(200, { countries: countriesData });
    } catch (error) {
        console.error('Lookups Error (countries):', error);
        return res.sendError(500);
    }
};
