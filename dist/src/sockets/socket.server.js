"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = exports.io = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const initializeSocket = (httpServer) => {
    exports.io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST'],
        },
    });
    exports.io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.headers['authorization'];
        if (!token)
            return next(new Error('Authentication error'));
        try {
            const decoded = jsonwebtoken_1.default.verify(token.replace('Bearer ', ''), process.env.JWT_ACCESS_SECRET);
            socket.data.user = { userId: decoded.userId, sessionId: decoded.sessionId };
            next();
        }
        catch (e) {
            next(new Error('Authentication error'));
        }
    });
    exports.io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}, User: ${socket.data.user.userId}`);
        // User joins a room for their own ID to receive direct updates
        socket.join(`user:${socket.data.user.userId}`);
        // Join conversation rooms
        socket.on('join_conversation', (conversationId) => {
            // In production, MUST verify if user is a member of this conversation first.
            socket.join(`conversation:${conversationId}`);
        });
        socket.on('typing:start', (conversationId) => {
            socket
                .to(`conversation:${conversationId}`)
                .emit('typing:start', { conversationId, userId: socket.data.user.userId });
        });
        socket.on('typing:stop', (conversationId) => {
            socket
                .to(`conversation:${conversationId}`)
                .emit('typing:stop', { conversationId, userId: socket.data.user.userId });
        });
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
    return exports.io;
};
exports.initializeSocket = initializeSocket;
