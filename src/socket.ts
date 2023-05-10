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

	});
}

	});
}

	});
}
