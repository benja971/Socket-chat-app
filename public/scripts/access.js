let g_user;

const accessForm = document.querySelector('#access-form');
const registerButton = document.querySelector('#register-button');
const loginButton = document.querySelector('#login-button');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');

if (!accessForm || !usernameInput || !passwordInput) {
	throw new Error('Could not find form or inputs');
}

const showMessageBox = () => {
	document.querySelector('#access').removeAttribute('active');
	document.querySelector('main').setAttribute('active', '');
	document.querySelector('#messages-container-container').setAttribute('active', '');
};

const emitIsLoggedEvent = user => {
	console.log('login event fired');
	const loginEvent = new CustomEvent('is-logged', {
		detail: { user },
	});

	document.dispatchEvent(loginEvent);
};

const handleAccessFormSubmit = async event => {
	event.preventDefault();
	const username = usernameInput.value;
	const password = passwordInput.value;

	const isRegister = event.submitter === registerButton;

	let response;
	if (isRegister) {
		response = await API.register(username, password);
	} else {
		response = await API.login(username, password);
	}

	const { user } = await response.json();

	if (!user) throw new Error('Could not login');

	document.querySelector('h2#username').textContent = user.username;
	g_user = user;

	document.querySelector('#access-form').reset();

	const { id } = user;
	socket.emit('save', id);

	showMessageBox();

	// emit a custom event to let other scripts know
	// that the user has logged in
	emitIsLoggedEvent(user);
};

accessForm.addEventListener('submit', handleAccessFormSubmit);
