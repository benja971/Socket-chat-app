const messageFactory = ({ senderId, senderUsername, content, discussionId }) => {
	const message = new Message();

	message.content = content;
	message.senderId = senderId;
	message.discussionId = discussionId;
	message.senderUsername = senderUsername;

	return message;
};

document.addEventListener('add-message', e => {
	const message = messageFactory(e.detail);
	messagesList.appendChild(message);

	messagesList.scrollTop = messagesList.scrollHeight;
});

document.addEventListener('new-message', e => {
	socket.emit('message', e.detail);

	const addMessageEvent = eventFactory('add-message', e.detail);
	document.dispatchEvent(addMessageEvent);
});

socket.on('message', message => {
	const { id } = messagesList.dataset;

	if (message.discussionId !== id) return;

	const addMessageEvent = eventFactory('add-message', message);
	document.dispatchEvent(addMessageEvent);
});
