import { TypeOf, object, string } from 'zod';

export const CreateDiscussionSchema = object({
	params: object({
		ownerId: string({
			required_error: 'Owner ID is required',
		}).uuid({
			message: 'An id must be a valid uuid',
		}),
	}),
	body: object({
		title: string({
			required_error: 'Title is required',
		})
			.min(1, 'Title must be at least 1 character long')
			.max(100, 'Title must be at most 100 characters long'),
		type: string({
			required_error: 'Type is required',
		}).refine(val => ['public', 'private'].includes(val), {
			message: 'Type must be either public or private',
		}),
	}),
});

export type CreateDiscussionInput = TypeOf<typeof CreateDiscussionSchema>['body'];
export type CreateDiscussionParams = TypeOf<typeof CreateDiscussionSchema>['params'];

