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

	// make a transaction to create discussion and add user to discussion
	// if any of the operation fails, rollback the transaction
	const transaction = await sequelize.transaction();

	try {
		// create discussion
		const discussion = await Discussion.create({
			title,
			type,
			ownerId,
		});

		// add user to discussion
		await DiscussionUsers.create({
			userId: ownerId,
			discussionId: discussion.id,
		});

		// commit the transaction
		await transaction.commit();

		return res.status(200).json({
			message: 'Discussion created successfully',
			discussion,
		});
	} catch (error: any) {
		// rollback the transaction
		await transaction.rollback();

		if (error.name === 'SequelizeValidationError') {
			const discussion = await Discussion.findOne({
				where: {
					title,
					type: 'private',
				},
			});

			console.log(discussion);

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

// TODO: must be set as a service
export async function addUsersToDiscussionHandler(req: Request<AddUserToDiscussionParams>, res: Response) {
	const { discussionId, userId, senderId } = req.params;

	// add user to discussion
	try {
		const userDiscussion = await DiscussionUsers.create({
			userId,
			discussionId,
		});


		return res.status(200).json({
			message: 'User added to discussion successfully',
			userDiscussion,
		});
	} catch (error: any) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			return res.status(400).json({
				message: 'User already added to discussion',
				error: error.message,
			});
		}

		return res.status(500).json({
			message: 'Something went wrong',
			error: error.message,
		});
	}
}
