import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/app.error';

export let io: SocketServer;

export const initializeSocket = (httpServer: HttpServer) => {
    io = new SocketServer(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST'],
        },
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.headers['authorization'];
        if (!token) return next(new Error('Authentication error'));

        try {
            const decoded = jwt.verify(
                token.replace('Bearer ', ''),
                process.env.JWT_ACCESS_SECRET as string,
            ) as any;
            socket.data.user = { userId: decoded.userId, sessionId: decoded.sessionId };
            next();
        } catch (e) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}, User: ${socket.data.user.userId}`);

        // User joins a room for their own ID to receive direct updates
        socket.join(`user:${socket.data.user.userId}`);

        // Join conversation rooms
        socket.on('join_conversation', (conversationId: string) => {
            // In production, MUST verify if user is a member of this conversation first.
            socket.join(`conversation:${conversationId}`);
        });

        socket.on('typing:start', (conversationId: string) => {
            socket
                .to(`conversation:${conversationId}`)
                .emit('typing:start', { conversationId, userId: socket.data.user.userId });
        });

        socket.on('typing:stop', (conversationId: string) => {
            socket
                .to(`conversation:${conversationId}`)
                .emit('typing:stop', { conversationId, userId: socket.data.user.userId });
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};
