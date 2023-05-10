class Message extends HTMLElement {
	#content;
	#senderUsername;
	#senderId;
	#discussionId;
	#isMine;

	constructor() {
		super();
	}

	connectedCallback() {
		this.innerHTML = `
        <div class="message ${this.#isMine ? 'me' : ''}">
			<span class="sender">${this.#senderUsername}</span>
            <span class="content">${this.#content}</span>
        </div>
        `;
	}

	attributeChangedCallback(name, _, newValue) {
		this[name] = newValue;
	}

	static get observedAttributes() {
		return ['content', 'sender-username', 'sender-id', 'discussion-id', 'is-mine'];
	}

	get content() {
		return this.#content;
	}

	set content(value) {
		this.#content = value;
	}

	get senderUsername() {
		return this.#senderUsername;
	}

	set senderUsername(value) {
		this.#senderUsername = value;
	}

	get senderId() {
		return this.#senderId;
	}

	set senderId(value) {
		this.#senderId = value;
		this.#isMine = value === g_user.id;
	}

	get discussionId() {
		return this.#discussionId;
	}

	set discussionId(value) {
		this.#discussionId = value;
	}

	get isMine() {
		return this.#isMine;
	}
}

customElements.define('app-message', Message);
