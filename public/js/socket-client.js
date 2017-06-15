const socketClient = {
	webSocket: null,
	init: () => {
		this.webSocket = io.connect('http://localhost:3000');
		this.webSocket.on('message', (message) => {
			alert(message);
		});
	},
	visit: (idUserProfil) => {
		if (!webSocket) {
			return false;
		}

		this.webSocket.emit('visit', idUserProfil);
	},
	message: (userId, message) => {
		if (!webSocket) {
			return false;
		}

		this.webSocket.emit('message', { userId: userId, message: message });
	}
};

window.socketClient = socketClient;
window.addEventListener('load', socketClient.init, false);
