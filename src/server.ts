import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import { sequelize } from './infrastructure/database/sequelize';
import { initializeSocket } from './sockets/socket.server';
import { setupAssociations } from './models';

dotenv.config();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const startServer = async () => {
    try {
        setupAssociations();
        await sequelize.authenticate();
        console.log('Database connection established.');

        // Ensure all tables are synced with the new unique_id columns
        await sequelize.sync({ alter: true });
        console.log('Database models synchronized.');

        initializeSocket(server);

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

startServer();
