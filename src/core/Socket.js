const io = require('socket.io'),
	_ = require('lodash'),
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
				socket.broadcast.emit('onlineMe', { status: 'connected', id: user.id });

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
					// Voir ici pour stop le chat si deux users connecte et un des deux dislike.
					SocketModel.addNewLikeToDb(user.id, user.login, idUserProfil)
						.then((response) => {
							debugger;
							if (response.error) {
								this.clientsList[user.id].emit('likeSessionError', response.error);
							} else if (!response.error) {
								this.clientsList[user.id].emit('likeSession', response);
								if (response.nbNotifs && this.clientsList[idUserProfil]) {
									this.clientsList[idUserProfil].emit('like', response);
								}
								if (!response.connected && this.clientsList[idUserProfil]) {
									response.idToRemove = user.id;
									this.clientsList[idUserProfil].emit('removeUserFromChat', response);
								}
							}
						})
						.catch((err) => {
							console.error(err);
						});
				});

				socket.on('message', (data) => {
					SocketModel.saveMessageOnDb(user.id, data.userId, _.escape(data.message).trim(), user.id)
						.then(() => {
							return SocketModel.addNewNotifForMess(user.id, user.login, data.userId);
						})
						.then((notifs) => {
							let res = {
								message: _.unescape(data.message),
								myId: user.id,
								otherId: data.userId
							};

							if (this.clientsList[data.userId]) {
								this.clientsList[data.userId].emit('notifMess', notifs);
								this.clientsList[data.userId].emit('messageOtherUser', res);
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

				socket.on('getOnlineUser', (idUserProfil) => {
					if (this.clientsList[idUserProfil]) {
						this.clientsList[user.id].emit('getOnlineUser', { status: 'connect', idUser: idUserProfil });
					}
				});

				socket.on('disconnect', () => {
					SocketModel.addDisconnectToDb(user.id)
						.then(() => {
							return SocketModel.getDateOfLastConnectedUser(user.id);
						})
						.then((date) => {
							socket.broadcast.emit('onlineMe', { status: 'disconnect', disconnect: date });
							socket.broadcast.emit('getOnlineUser', { status: 'disconnect', idUser: user.id });
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
