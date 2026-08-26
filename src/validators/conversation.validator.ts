import Joi from 'joi';

export const conversationValidator = {
    createDirect: Joi.object({
        userId: Joi.string().uuid().required(),
    }).options({ stripUnknown: false, presence: 'required' }),

    createGroup: Joi.object({
        name: Joi.string().min(1).max(255).required(),
        userIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
    }).options({ stripUnknown: false, presence: 'required' }),

    sendMessage: Joi.object({
        content: Joi.string().required(),
        messageType: Joi.string()
            .valid('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'FILE')
            .required(),
        replyToMessageId: Joi.string().uuid().optional(),
    }).options({ stripUnknown: false, presence: 'required' }),

    getMessages: Joi.object({
        cursor: Joi.string().isoDate().optional(),
        limit: Joi.number().integer().min(1).max(100).default(50),
    }).options({ stripUnknown: false }),
};
