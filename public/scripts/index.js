// io client
const socket = io();

socket.connect('http://192.168.1.21:8080');

socket.on('connect', () => {
	console.log('connected');
	// socket usage
});
