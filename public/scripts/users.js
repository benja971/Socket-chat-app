function discussionFactory(user) {
	const isContact = user.hasOwnProperty('username');

	const discussion = new Discussion();
	discussion.id = user.id;
	const title = isContact ? user.username : user.title;
	discussion.title = title;
	discussion.type = isContact ? 'contact' : 'group';
	discussion.isContact = isContact;

	return discussion;
}

const usersList = document.querySelector('#users');

document.addEventListener('is-logged', async e => {
	const { user: logged_user } = e.detail;

	const { discussions } = await API.getDiscussions(logged_user.id);
	const { users } = await API.getUsers(logged_user.id);

	const allUsers = [];

	for (const u of users) {
		const discussionTitle = [logged_user.username, u.username].sort().join('-');
		const discussion = discussions.find(d => d.title === discussionTitle);

		// if there is a discussion between the two users
		if (discussion) {
			allUsers.push({
				id: discussion.id,
				title: discussion.title.replace(g_user.username, '').replace('-', ''),
			});

			// remove the discussion from the list
			discussions.splice(discussions.indexOf(discussion), 1);
		}

		//if there is no discussion between the two users
		else allUsers.push(u);
	}

	// add the remaining discussions
	allUsers.push(...discussions);

	allUsers.forEach(u => {
		const discussion = discussionFactory(u);
		usersList.appendChild(discussion);
	});
});

socket.on('contactRequest', async ({ contactId }) => {
	console.log({ contactId });
	const user = document.querySelector(`div[data-id="${contactId}"]`);

	console.log(user);

	if (user) {
		user.classList.remove('user');
		user.classList.add('discussion');
	}
});

socket.on('new-user', async ({ userId }) => {
	const { user } = await API.getUserById(userId);

	console.log({ user });

	usersList.appendChild(discussionFactory(user));
});
