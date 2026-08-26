"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express_1.default.json({ limit: process.env.MAX_REQUEST_SIZE || '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
const routes_1 = __importDefault(require("./routes"));
const swagger_1 = require("./docs/swagger");
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
(0, swagger_1.setupSwagger)(app);
app.use('/api', routes_1.default);
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
