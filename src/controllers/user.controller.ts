import { TCreateUserInput, TFindUserByIdInput, TGetUserInput, TGetUsersInput } from '../schemas/user.schema';
import User from '../models/user.model';
import log from '../utils/logger';
export async function createUserHandler(req: Request<{}, {}, TCreateUserInput>, res: Response): Promise<void> {
	const { username, password } = req.body;


	try {
		const user = await User.create({
			username,
			password,
		});


		res.json({
			message: `Welcome ${user.username}! You have successfully signed up`,
			user,
		});
	} catch (error: any) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			res.status(409).send({
				message: `User ${username} already exists`,
			});
		} else {
			res.status(500).send({
				message: 'Something went wrong',
			});
		}
	}
}

