"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const sequelize_1 = require("./infrastructure/database/sequelize");
const socket_server_1 = require("./sockets/socket.server");
const models_1 = require("./models");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const server = http_1.default.createServer(app_1.default);
const startServer = async () => {
    try {
        (0, models_1.setupAssociations)();
        await sequelize_1.sequelize.authenticate();
        console.log('Database connection established.');
        (0, socket_server_1.initializeSocket)(server);
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};
startServer();
