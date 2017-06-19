const io = require('socket.io'),
	SocketModel = require('../models/SocketModel'),
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
				console.log('Un client est connecté');
				console.log(Object.keys(this.clientsList));

				socket.on('visit', (idUserProfil) => {
					SocketModel.addNewVisitToDb(user.id, user.login, idUserProfil)
						.then(() => {
							if (this.clientsList[idUserProfil]) {
								this.clientsList[idUserProfil].emit('visit', user.login);
							}
						})
						.catch((err) => {
							console.error(err);
						});
				});

				socket.on('like', (idUserProfil) => {
					SocketModel.addNewLikeToDb(user.id, user.login, idUserProfil)
						.then(() => {
							if (this.clientsList[idUserProfil]) {
								this.clientsList[idUserProfil].emit('like', user.login);
							}
						})
						.catch((err) => {
							console.error(err);
						});
				});

				socket.on('message', (data) => {
					this.clientsList[data.userId].emit('message', data.message);
				});

				socket.on('disconnect', () => {
					SocketModel.addDisconnectToDb(user.id)
						.then(() => {
							delete this.clientsList[user.id];
						})
						.catch((err) => {
							console.error(err);
						});
				});
			}
		});
	}
}
module.exports = SocketIo;
