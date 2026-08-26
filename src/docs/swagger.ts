import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Chat API',
        version: '1.0.0',
        description: 'A production-ready WhatsApp-like Chat Backend API',
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
            signatureAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'x-api-signature',
            },
        },
    },
    paths: {
        '/api/auth/register': {
            post: {
                summary: 'Register a new user',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: { '201': { description: 'Created' } },
            },
        },
        '/api/auth/login': {
            post: {
                summary: 'Login user',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' },
                                    deviceId: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: { '200': { description: 'Success' } },
            },
        },
    },
};

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
