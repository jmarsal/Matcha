const express = require('express'),
	SocketModel = require('../models/SocketModel');
Helper = require('../core/Helpers');

class NotifsController {
	constructor() {
		if (!app) {
			console.error('Error! Exiting... You must provide the Express instance to controllers.');
			process.exit(1);
		}

		this.router = express.Router();
		this.notifsRoutes();
		app.use('/', this.router);
	}

	notifsRoutes() {
		// this.notifierRoute();
		this.notifierPostRoute();
	}

	// notifierRoute() {
	// 	this.router.get('/notifications', (req, res) => {
	// 		if (req.session.start) {
	// 			res.render('./views/notifs/notifsContent', {
	// 				title: 'Voici les notifications ...'
	// 			});
	// 		}
	// 	});
	// }

	notifierPostRoute() {
		this.router.post('/notifications', (req, res) => {
			SocketModel.getNotificationsInDb(req.session.user.id)
				.then((notifs) => {
					Helper.sendResponseToClient(notifs, 0, res);
				})
				.catch((err) => {
					console.error(err);
				});
		});
	}
}
module.exports = NotifsController;
