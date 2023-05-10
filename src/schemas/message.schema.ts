import { object, string, TypeOf } from 'zod';

export const getMessagesSchema = object({
	params: object({
		discussionId: string({
			required_error: 'Discussion id is required',
		}).uuid({ message: 'An id must be a valid uuid' }),
	}),
});

export type TGetMessagesParams = TypeOf<typeof getMessagesSchema>['params'];
