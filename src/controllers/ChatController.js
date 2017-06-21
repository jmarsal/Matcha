const express = require('express'),
	ChatModel = require('../models/UserModel'),
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
				res.render('./views/chat/chatContent', {
					title: 'Messenger',
					error: 'Aucun utilisateurs liké ne vous like en retour pour le moment... Le chat est donc fermé !'
				});
			} else {
				res.redirect('../accueil');
			}
		});
	}
}
module.exports = ChatController;
