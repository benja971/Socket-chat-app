const messagesList = document.querySelector('#messages-container');
const inputBox = document.querySelector('#input-box');
const inputForm = document.querySelector('#input-form');
const messageInput = document.querySelector('#message-input');

const toggleActive = htmlElement => {
	const isActive = htmlElement.getAttribute('active');

	if (isActive === 'true') return htmlElement.setAttribute('active', false);
	else return htmlElement.setAttribute('active', true);
};

const clearHtmlElement = htmlElement => {
	htmlElement.innerHTML = '';
};

const eventFactory = (eventName, detail) => {
	return new CustomEvent(eventName, {
		detail,
	});
};

const emitEvent = event => {
	document.dispatchEvent(event);
};

document.addEventListener('discussion-selected', async e => {
	toggleActive(messagesList);
	toggleActive(inputForm);
	toggleActive(inputBox);
	clearHtmlElement(messagesList);

	const { id, title } = e.detail;

	messagesList.dataset.id = id;
	messagesList.dataset.title = title;

	const { messages } = await API.getMessages(id);

	messages.forEach(m => {
		const addMessageEvent = eventFactory('add-message', m);
		emitEvent(addMessageEvent);
	});
});

inputForm.addEventListener('submit', e => {
	e.preventDefault();

	const content = messageInput.value;
	const senderId = g_user.id;
	const discussionId = messagesList.dataset.id;

	const message = {
		senderId,
		content,
		discussionId,
		senderUsername: g_user.username,
	};

	messageInput.value = '';

	const addMessageEvent = eventFactory('new-message', message);
	emitEvent(addMessageEvent);
});
