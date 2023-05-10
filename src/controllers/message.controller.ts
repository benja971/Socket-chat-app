import { Request, Response } from 'express';
import { TGetMessagesParams } from '../schemas/message.schema';
import Message from '../models/message.model';
import log from '../utils/logger';
import User from '../models/user.model';

export async function getMessagesHandler(req: Request<TGetMessagesParams>, res: Response) {
	const { discussionId } = req.params;

	try {
		const rawMessages = await Message.findAll({
			where: {
				discussionId,
			},
			include: [
				{
					model: User,
					attributes: ['username'],
				},
			],
			order: [['createdAt', 'ASC']],
		});

		const messages = rawMessages.map(message => {
			const senderUsername = message.user?.username;
			delete message.dataValues.user;

			return {
				...message.dataValues,
				senderUsername,
			};
		});

		return res.status(200).json({
			message: 'Messages fetched successfully',
			messages,
		});
	} catch (error) {
		log.error(error);

		return res.status(500).json({
			message: 'Something went wrong',
		});
	}
}
