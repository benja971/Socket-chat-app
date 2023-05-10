import { Request, Response } from 'express';
import { sequelize } from '../models/database';
import Discussion from '../models/discussion.model';
import DiscussionUsers from '../models/discussionUsers.model';
import {
	AddUserToDiscussionParams,
	CreateDiscussionInput,
	CreateDiscussionParams,
	FindDiscussionByTitleParams,
	FindDiscussionParams,
	ListDiscussionMembersParams,
	ListDiscussionParams,
} from '../schemas/discussion.schema';
import { findDiscussionByTitle, getDiscussionMembers, listDiscussions } from '../services/discussions.services';
import log from '../utils/logger';
import { addToContacts } from '../socket';

export async function createDiscussionHandler(req: Request<CreateDiscussionParams, {}, CreateDiscussionInput>, res: Response) {
	const { ownerId } = req.params;
	const { title, type } = req.body;

	try {
		// create discussion
		const discussion = await Discussion.create({
			title,
			type,
			ownerId,
		});

		return res.status(200).json({
			message: 'Discussion created successfully',
			discussion,
		});
	} catch (error: any) {
		if (error.name === 'SequelizeValidationError') {
			const discussion = await Discussion.findOne({
				where: {
					title,
					type: 'private',
				},
			});

			return res.status(400).json({
				message: 'A private discussion with this title already exists',
				discussion,
			});
		}

		return res.status(500).json({
			message: 'Something went wrong',
			error: error.message,
		});
	}
}

