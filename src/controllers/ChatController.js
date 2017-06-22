const express = require('express'),
	ChatModel = require('../models/ChatModel'),
	Helper = require('../core/Helpers');

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
		// this.messengerPostRoute();
	}

	messengerRoute() {
		this.router.get('/messenger', (req, res) => {
			if (req.session.start) {
				let data = {};

				ChatModel.getUsersForChat(req.session.user.id)
					.then((users) => {
						data.users = users;
						if (data.users.length) {
							res.render('./views/chat/chatContent', {
								title: data.users[0].login_user2,
								users: data.users
							});
						} else {
							res.render('./views/chat/chatContent', {
								title: 'Messenger',
								error:
									'Aucun utilisateurs liké ne vous like en retour pour le moment... Le chat est donc fermé !'
							});
						}
						// plus tard return historique des conversations en lien avec les users recuperer precedement
					})
					.catch((err) => {
						console.error(err);
					});
			} else {
				res.redirect('../accueil');
			}
		});
	}
}
module.exports = ChatController;
