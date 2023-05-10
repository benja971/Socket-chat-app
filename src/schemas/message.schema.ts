import { object, string, TypeOf } from 'zod';

export const getMessagesSchema = object({
	params: object({
		discussionId: string({
			required_error: 'Discussion id is required',
		}).uuid({ message: 'An id must be a valid uuid' }),
	}),
});

export type TGetMessagesParams = TypeOf<typeof getMessagesSchema>['params'];

export const MessageFromClientSchema = object({
	senderId: string({
		required_error: 'User id is required',
	}).uuid({ message: 'An id must be a valid uuid' }),
	discussionId: string({
		required_error: 'Discussion id is required',
	}).uuid({ message: 'An id must be a valid uuid' }),
	content: string({
		required_error: 'Content is required',
	}),
	senderUsername: string({
		required_error: 'Sender username is required',
	}),
});

export type TMessageFromClient = TypeOf<typeof MessageFromClientSchema>;
