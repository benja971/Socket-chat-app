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

