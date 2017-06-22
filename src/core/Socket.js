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
				socket.broadcast.emit('onlineMe', { status: 'connected' });
				console.log('Un client est connecté');
				console.log(Object.keys(this.clientsList));

				socket.on('visit', (idUserProfil) => {
					SocketModel.addNewVisitToDb(user.id, user.login, idUserProfil)
						.then((nbNotifs) => {
							if (nbNotifs !== false) {
								if (this.clientsList[idUserProfil]) {
									this.clientsList[idUserProfil].emit('visit', nbNotifs);
								}
							}
						})
						.catch((err) => {
							console.error(err);
						});
				});

				socket.on('like', (idUserProfil) => {
					SocketModel.addNewLikeToDb(user.id, user.login, idUserProfil)
						.then((response) => {
							if (response.error) {
								this.clientsList[user.id].emit('likeSessionError', response.error);
							} else if (!response.error) {
								this.clientsList[user.id].emit('likeSession', response);
								if (response.nbNotifs && this.clientsList[idUserProfil]) {
									this.clientsList[idUserProfil].emit('like', response);
								}
							}
						})
						.catch((err) => {
							console.error(err);
						});
				});

				socket.on('message', (data) => {
					SocketModel.saveMessageOnDb(user.id, data.userId, data.message, user.id)
						.then(() => {
							if (this.clientsList[data.userId]) {
								this.clientsList[data.userId].emit('message', data.message);
							}
							this.clientsList[user.id].emit('message', data.message);
						})
						.catch((err) => {
							console.error(err);
						});
				});

				socket.on('online', (idUserProfil) => {
					if (this.clientsList[idUserProfil]) {
						this.clientsList[user.id].emit('online', { class: 'green' });
					} else {
						SocketModel.getDateOfLastConnectedUser(idUserProfil)
							.then((date) => {
								this.clientsList[user.id].emit('online', { class: 'red', disconnect: date });
							})
							.catch((err) => {
								console.error(err);
							});
					}
				});

				socket.on('onlineMe', () => {
					socket.broadcast.emit('onlineMe', { status: 'connected' });
				});

				socket.on('disconnect', () => {
					SocketModel.addDisconnectToDb(user.id)
						.then(() => {
							return SocketModel.getDateOfLastConnectedUser(user.id);
						})
						.then((date) => {
							socket.broadcast.emit('onlineMe', { status: 'disconnect', disconnect: date });
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
