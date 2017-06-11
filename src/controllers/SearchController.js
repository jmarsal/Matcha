/**
 * Created by jbmar on 30/04/2017.
 */

const express = require('express'),
	BrowseModel = require('../models/BrowseModel'),
	UserModel = require('../models/UserModel'),
	Helper = require('../core/Helpers');

class SearchController {
	constructor() {
		if (!app) {
			console.error('Error! Exiting... You must provide the Express instance to controllers.');
			process.exit(1);
		}

		this.router = express.Router();
		this.registerRoutes();
		app.use('/', this.router);
	}

	registerRoutes() {
		this.searchRoute();
		// this.searchPostRoute();
	}

	searchRoute() {
		this.router.get('/search', (req, res) => {
			if (req.session.start) {
				let infos = {};

				UserModel.getPhotoProfil(req.session.user.id)
					.then((photoUserSession) => {
						infos.photosProfil = photoUserSession.photosProfil;
						res.render('./views/search/searchContent', {
							title: 'Recherche !!!',
							photoFav: infos.photosProfil ? infos.photosProfil : ''
						});
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
module.exports = SearchController;
