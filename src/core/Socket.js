const io = require('socket.io'),
	VisitModel = require('../models/VisitModel'),
	sharedsession = require('express-socket.io-session');

class SocketIo {
	constructor() {
		this.socketIo = new io(app.get('httpServer'));
		this.socketIo.use(sharedsession(app.get('session')));
		this.clientsList = {};

		this.connectSocket();
	}

	connectSocket() {
		// Quand un client se connecte, on le note dans la console
		this.socketIo.on('connection', (socket) => {
			const user = socket.handshake.session.user;

			if (user) {
				this.clientsList[user.id] = socket;
				// socket.on('visit', (idUser) => {
				// 	VisitModel.addNewVisitToDb(me.id, idUser);
				// });
				console.log('Un client est connecté');
				console.log(Object.keys(this.clientsList));

				socket.on('visit', (idUserProfil) => {
					console.log(idUserProfil);
				});

				socket.on('message', (data) => {
					this.clientsList[data.userId].emit('message', data.message);
				});

				socket.on('disconnect', () => delete this.clientsList[user.id]);
			}
		});
	}
}
module.exports = SocketIo;
