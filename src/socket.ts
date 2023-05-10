import { Server, Socket } from 'socket.io';
import log from './utils/logger';
import { saveMessage } from './services/messages.services';
import { TMessageFromClient } from './schemas/message.schema';
import { getDiscussionMembers } from './services/discussions.services';
import Message from './models/message.model';

export const socketMap = new Map<string, Socket>();

export default function socketHandler(io: Server) {
	io.on('connection', socket => {
		socket.on('save', userId => {
			log.debug(`Saving socket for user ${userId}`);
			socketMap.set(userId, socket);
			log.debug(`Socket map size: ${socketMap.size}`);
		});

		socket.on('disconnect', () => {
			log.debug(`Socket disconnected: ${socket.id}`);

			socketMap.forEach((value, key) => {
				if (value === socket) {
					log.debug(`Removing socket for user ${key}`);
					socketMap.delete(key);
				}
			});

			log.debug(`Socket map size: ${socketMap.size}`);
		});

		socket.on('message', async (data: TMessageFromClient) => {
			const { senderId, discussionId, content, senderUsername } = data;
			log.debug(`Received ${content} from ${senderId} in discussion ${discussionId}`);

			try {
				const message = await saveMessage(senderId, discussionId, content);
				const messageWithSenderUsername: Message = {
					...message.dataValues,
					senderUsername,
				};
				const discussionUsers = await getDiscussionMembers(discussionId);

				const others = discussionUsers.filter(user => {
					log.debug(`username ${user.username}: id ${user.id}`);
					return user.id !== senderId;
				});
				log.debug(`Sending message to ${others.length} users`);

				others.forEach(user => {
					const socket = socketMap.get(user.id!);

					if (socket) {
						log.debug(`Sending message to ${user.id}`);
						socket.emit('message', messageWithSenderUsername);
					}
				});
			} catch (error) {
				log.error(error);
			}
		});
	});
}

export function addToContacts(emitterId: string, receiverId: string) {
	const socket = socketMap.get(emitterId);

	if (socket) {
		socket.emit('contactRequest', {
			contactId: receiverId,
		});
	}
}

	});
}
