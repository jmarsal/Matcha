const io = require('socket.io');

class SocketIo {
	constructor() {
		this.socketIo = new io(app.get('httpServer'));
		this.clientsList = {};

		this.connectSocket();
	}

	connectSocket() {
		// Quand un client se connecte, on le note dans la console
		this.socketIo.on('connection', (socket) => {
			console.log('Un client est connecté !');

			socket.on('toto', (message) => {
				console.log(message);
			});
		});
	}
}
module.exports = SocketIo;
