import { I18n } from 'i18n';
import successEn from '../locales/en/success.json';
import errorEn from '../locales/en/error.json';

export const i18n = new I18n({
    locales: ['en'],
    staticCatalog: {
        en: {
            ...successEn,
            ...errorEn,
        },
    },
    defaultLocale: 'en',
    objectNotation: true,
    autoReload: true,
    updateFiles: false,
});
