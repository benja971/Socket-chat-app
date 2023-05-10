
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

