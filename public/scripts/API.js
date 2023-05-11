class API {
	static BASE_URL = `https://pji-v1.benjamin-niddam.dev/api/v1`;

	static #safeFetch = async (url, payload) => {
		const response = await fetch(url, payload);
		if (response.ok) {
			return response;
		} else {
			const { message, error, discussion } = await response.json();

			if (discussion) {
				return { message, discussion };
			}

			let errorMessage = message || error;

			throw new Error(errorMessage);
		}
	};

	static login = async (username, password) => {
		const response = await this.#safeFetch(`${API.BASE_URL}/users/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		});
		return response;
	};

	static register = async (username, password) => {
		const response = await this.#safeFetch(`${API.BASE_URL}/users`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		});
		return response;
	};

	static getUsers = async userId => {
		const response = await this.#safeFetch(`${API.BASE_URL}/users/${userId}`);
		return await response.json();
	};

	static getUserById = async userId => {
		const response = await this.#safeFetch(`${API.BASE_URL}/users/user/${userId}`);
		return await response.json();
	};

	static createDiscussion = async (userId, title, type) => {
		const response = await this.#safeFetch(`${API.BASE_URL}/discussions/${userId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title, type }),
		});

		if (response.discussion) return response;

		return await response.json();
	};

	static addDiscussionMember = async (discussionId, senderId, userId) => {
		const response = await this.#safeFetch(`${API.BASE_URL}/discussions/${discussionId}/members/${senderId}/${userId}`, {
			method: 'PUT',
		});
		return await response.json();
	};

	static getDiscussions = async userId => {
		const response = await this.#safeFetch(`${API.BASE_URL}/discussions/${userId}`);
		return await response.json();
	};

	static getDiscussionById = async (ownerId, discussionId) => {
		const response = await this.#safeFetch(`${API.BASE_URL}/discussions/find-by-id/${ownerId}/${discussionId}`);
		return await response.json();
	};

	static getDiscussionByTitle = async (type, title) => {
		const response = await this.#safeFetch(`${API.BASE_URL}/discussions/find-by-title/${type}/${title}`);
		return await response.json();
	};

	static getPrivateDiscussion = async (ownerId, contactId) => {
		const response = await this.#safeFetch(`${API.BASE_URL}/discussions/find/private/${ownerId}/${contactId}`);
		return await response.json();
	};

	static getDiscussionMembers = async discussionId => {
		const response = await this.#safeFetch(`${API.BASE_URL}/discussions/${discussionId}/members`);
		return await response.json();
	};

	static getMessages = async discussionId => {
		const response = await this.#safeFetch(`${API.BASE_URL}/messages/${discussionId}`);
		return await response.json();
	};

	static create1to1Discussion = async (userId, contactId, title) => {
		try {
			const { discussion } = await API.createDiscussion(userId, title, 'private');
			const { id: discussionId } = discussion;

			// Add the contact to the discussion
			await API.addDiscussionMember(discussionId, userId, contactId);

			return discussionId;
		} catch (error) {
			console.error(error);
			throw error;
		}
	};
}
