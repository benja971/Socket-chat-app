import { TCreateUserInput, TFindUserByIdInput, TGetUserInput, TGetUsersInput } from '../schemas/user.schema';
import User from '../models/user.model';
import log from '../utils/logger';
import { Op } from 'sequelize';
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


export async function getUsersHandler(req: Request<TGetUsersInput>, res: Response) {
	const { userId } = req.params;

	try {
		const users = await User.findAll({
			where: {
				// id is not equal to the current user id
				id: { [Op.ne]: userId },
			},
			attributes: ['id', 'username'],
		});

		res.json({
			message: 'Users fetched successfully',
			users,
		});
	} catch (error: any) {
		res.status(500).send({
			message: 'Something went wrong',
		});
	}
}

export async function findUserByIdHandler(req: Request<TFindUserByIdInput>, res: Response) {
	const { userId } = req.params;

	try {
		const user = await User.findOne({
			where: {
				id: userId,
			},
			attributes: ['id', 'username'],
		});

		if (!user)
			return res.status(404).send({
				message: `User ${userId} not found`,
			});

		res.json({
			user,
		});
	} catch (error: any) {
		res.status(500).send({
			message: 'Something went wrong',
		});
	}
}
