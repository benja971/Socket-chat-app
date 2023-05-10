import Discussion from '../models/discussion.model';
import DiscussionUsers from '../models/discussionUsers.model';
import User from '../models/user.model';
import log from '../utils/logger';

export async function getDiscussionMembers(discussionId: string) {
	const discussionUsers = await DiscussionUsers.findAll({
		where: {
			discussionId,
		},
		include: [
			{
				model: User,
				attributes: ['id', 'username'],
			},
		],
		attributes: ['discussionId'],
	});

	const flatten = discussionUsers.map((discussionUser: DiscussionUsers) => {
		return {
			id: discussionUser.user?.id,
			username: discussionUser.user?.username,
		};
	});

	return flatten;
}

export async function listDiscussions(ownerId: string) {
	const participatedDiscussions = await DiscussionUsers.findAll({
		where: {
			userId: ownerId,
		},
		include: [
			{
				model: Discussion,
			},
		],
	});

	const all = participatedDiscussions.map(discussion => discussion.discussion as Discussion);

	// remove duplicates
	const discussions: Discussion[] = all.filter((discussion, index) => {
		const _discussion = JSON.stringify(discussion);
		return index === all.findIndex(obj => JSON.stringify(obj) === _discussion);
	});

	log.debug(discussions);
	return discussions;
}

