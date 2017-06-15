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
			socket.on('login', (user) => {
				this.clientsList[user.id] = user;
			});
			console.log('Un client est connecté');
		});
		console.log(this.clientsList);
	}
}
module.exports = SocketIo;
