const express = require('express'),
	ChatModel = require('../models/ChatModel'),
	Helper = require('../core/Helpers'),
	BrowseModel = require('../models/BrowseModel');

class ChatController {
	constructor() {
		if (!app) {
			console.error('Error! Exiting... You must provide the Express instance to controllers.');
			process.exit(1);
		}

		this.router = express.Router();
		this.chatRoutes();
		app.use('/', this.router);
	}

	chatRoutes() {
		this.messengerRoute();
		this.messengerPostRoute();
	}

	messengerRoute() {
		this.router.get('/messenger', (req, res) => {
			if (req.session.start) {
				let data = {};

				ChatModel.getUsersForChat(req.session.user.id)
					.then((users) => {
						data.users = users;
						return BrowseModel.getInfosUserSession(req.session.user.id);
					})
					.then((infosUserSession) => {
						data.infosUserSession = infosUserSession;
						return ChatModel.getHistoryMessage(req.session.user.id);
					})
					.then((allHistory) => {
						if (allHistory.length) {
							return ChatModel.getHistoryForUserDefault(allHistory, data.users[0].id_user2);
						} else {
							return false;
						}
					})
					.then((messages) => {
						if (data.users.length) {
							res.render('./views/chat/chatContent', {
								title: data.users[0].login_user2,
								users: data.users,
								messages: messages,
								myId: req.session.user.id,
								photoFav: req.session.user.photoFav,
								nbNotif: data.infosUserSession[0].notifications
							});
						} else {
							res.render('./views/chat/chatContent', {
								title: 'Messenger',
								error:
									'Aucun utilisateurs liké ne vous like en retour pour le moment... Le chat est donc fermé !',
								photoFav: req.session.user.photoFav,
								nbNotif: data.infosUserSession[0].notifications
							});
						}
					})
					.catch((err) => {
						console.error(err);
					});
			} else {
				res.redirect('../accueil');
			}
		});
	}

	messengerPostRoute() {
		this.router.post('/chat/Change-User', (req, res) => {
			let messUser = {};

			ChatModel.getHistoryMessage(req.session.user.id)
				.then((allHistory) => {
					if (allHistory.length) {
						return ChatModel.getHistoryForUserDefault(allHistory, req.body.user);
					} else {
						return false;
					}
				})
				.then((messages) => {
					messUser = messages;

					return ChatModel.getLoginById(req.body.user);
				})
				.then((login) => {
					const response = {
						messages: messUser,
						login: login
					};
					Helper.sendResponseToClient(response, 0, res);
				})
				.catch((err) => {
					console.error(err);
				});
		});
	}
}
module.exports = ChatController;
