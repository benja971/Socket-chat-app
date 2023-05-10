import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
	body: object({
		username: string({
			required_error: 'Username is required',
		})
			.min(3, 'Username must be at least 3 characters long')
			.max(20, 'Username must be at most 20 characters long'),
		password: string({
			required_error: 'Password is required',
		})
			.min(6, 'Password must be at least 6 characters long')
			.max(20, 'Password must be at most 20 characters long'),
	}),
});

export const getUsersSchema = object({
	params: object({
		userId: string({
			required_error: 'userId is required',
		}).uuid({ message: 'An id must be a valid uuid' }),
	}),
});

export type TGetUsersInput = TypeOf<typeof getUsersSchema>['params'];

export const FindUserByIdSchema = object({
	params: object({
		userId: string({
			required_error: 'userId is required',
		}).uuid({ message: 'An id must be a valid uuid' }),
	}),
});

export type TFindUserByIdInput = TypeOf<typeof FindUserByIdSchema>['params'];
