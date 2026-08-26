"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18n = void 0;
const i18n_1 = require("i18n");
const success_json_1 = __importDefault(require("../locales/en/success.json"));
const error_json_1 = __importDefault(require("../locales/en/error.json"));
exports.i18n = new i18n_1.I18n({
    locales: ['en'],
    staticCatalog: {
        en: {
            ...success_json_1.default,
            ...error_json_1.default,
        },
    },
    defaultLocale: 'en',
    objectNotation: true,
    autoReload: true,
    updateFiles: false,
});
