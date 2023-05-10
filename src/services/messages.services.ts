import Message from '../models/message.model';

export async function saveMessage(senderId: string, discussionId: string, content: string) {
	const message = await Message.create({
		senderId,
		discussionId,
		content,
	});

	if (!message) {
		throw new Error('Message not saved');
	}

	return message;
}
