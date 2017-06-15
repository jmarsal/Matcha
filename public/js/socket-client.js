const socketClient = {
	webSocket: null,
	init: () => {
		this.webSocket = io.connect('http://localhost:3000');
	},
	login: (channel, user) => {
		if (!webSocket) {
			return false;
		}
		console.log(channel + user);
		this.webSocket.emit(channel, user);
	},
	message: (channel, message) => {
		if (!webSocket) {
			return false;
		}

		this.webSocket.emit(channel, message);
	}
};

window.socketClient = socketClient;
window.addEventListener('load', socketClient.init, false);
