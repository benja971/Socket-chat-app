class Discussion extends HTMLElement {
	#id;
	#title;
	#type;
	#isContact;
	#correctedTitle;

	constructor() {
		super();

		this.addEventListener('click', this.#onClickHandler);
	}

	connectedCallback() {
		this.innerHTML = `
        <div class="${this.#isContact ? 'user' : 'discussion'}" data-id="${this.#id}" data-type="${this.#type}">
            <span class="title">${this.#correctedTitle}</span>
        </div>
        `;
	}

	async #onClickHandler() {
		console.log(`id before: ${this.#id}`);
		if (this.#isContact) {
			const title = [g_user.username, this.#title].sort().join('-');
			try {
				const { discussion } = await API.getDiscussionByTitle('private', title);
				this.#id = discussion.id;
			} catch (error) {
				if (error.message === 'Discussion not found') {
					this.#id = await API.create1to1Discussion(g_user.id, this.#id, title);
				} else throw error;
			}

			this.#title = title;
			this.#type = 'private';
			this.#isContact = false;

			const splitTitle = this.#title.split('-');
			this.#correctedTitle = splitTitle[0] === g_user.username ? splitTitle[1] : splitTitle[0];

			console.log(`id after: ${this.#id}`);
		}
		// refresh component
		this.connectedCallback();

		// dispatch event
		const event = new CustomEvent('discussion-selected', {
			detail: {
				id: this.#id,
				title: this.#title,
			},
		});

		document.dispatchEvent(event);
	}

	attributeChangedCallback(name, _, newValue) {
		this[name] = newValue;
	}

	// getters and setters
	get id() {
		return this.#id;
	}

	set id(value) {
		this.#id = value;
	}

	get title() {
		return this.#title;
	}

	set title(value) {
		this.#title = value;
		const splitTitle = this.#title.split('-');
		this.#correctedTitle = splitTitle[0] === g_user.username ? splitTitle[1] : splitTitle[0];
	}

	get type() {
		return this.#type;
	}

	set type(value) {
		this.#type = value;
	}

	get isContact() {
		return this.#isContact;
	}

	set isContact(value) {
		this.#isContact = value;
	}

	static get observedAttributes() {
		return ['id', 'title', 'type', 'isContact'];
	}
}

customElements.define('app-discussion', Discussion);
