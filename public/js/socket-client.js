const socketClient = {
	webSocket: null,
	init: () => {
		this.webSocket = io.connect('http://localhost:3000');
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
