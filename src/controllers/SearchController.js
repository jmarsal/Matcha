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
		this.searchPostRoute();
	}

	searchRoute() {
		this.router.get('/search', (req, res) => {
			if (req.session.start) {
				let profils = [];

				BrowseModel.getInfosAllProfils(req.session.user.id)
					.then((infos) => {
						profils.infos = infos;
						return BrowseModel.getAllPhotosProfils(req.session.user.id);
					})
					.then((photos) => {
						profils.photos = photos;
						return BrowseModel.getInfosUserSession(req.session.user.id);
					})
					.then((infosUserSession) => {
						profils.infosUserSession = infosUserSession;
						return BrowseModel.updateDistanceFromUserAndtheOther(
							req.session.user.id,
							profils.infos,
							infosUserSession
						);
					})
					.then((distancesFromUsers) => {
						profils.distances = distancesFromUsers;
						return BrowseModel.getCommunTagsByUsers(req.session.user.id);
					})
					.then(() => {
						return UserModel.getTagsInDb(req.session.user.id);
					})
					.then((retTags) => {
						for (let i = 0; i < retTags.tags.length; i++) {
							retTags.check[i].idTag = retTags.tags[i].id;
							for (let j = 0; j < retTags.tags_user.length; j++) {
								if (retTags.tags[i].tag === retTags.tags_user[j].tag) {
									retTags.check[i].check = true;
									j = retTags.tags_user.length;
								} else {
									retTags.check[i].check = false;
								}
							}
						}
						profils.tags = retTags;
						return UserModel.getPhotoProfil(req.session.user.id);
					})
					.then((photoUserSession) => {
						profils.photosProfil = photoUserSession.photosProfil;
						return BrowseModel.filterProfilsOrderByDistance(
							req.session.user.id,
							profils.infosUserSession,
							'ASC',
							null,
							null,
							'noUsersWithZoneSize',
							null,
							null
						);
					})
					.then((profilsOrder) => {
						res.render('./views/search/searchContent', {
							title: 'Recherche ...',
							profils: profilsOrder,
							photos: profils.photos,
							photoFav: profils.photosProfil ? profils.photosProfil : '',
							tags: profils.tags.tags,
							tagsUser: profils.tags.tags_user,
							check: profils.tags.check
						});
					})
					.catch((err) => {
						console.error(err);
					});
			} else {
				res.redirect('../accueil');
			}
		});

		this.router.get('/browse/profil', (req, res) => {
			if (req.session.start) {
				let user = req.query.user,
					infos = {};

				BrowseModel.getInfosUserSession(user)
					.then((infosUserSession) => {
						infos.infos = infosUserSession;

						return BrowseModel.getAllPhotoUser(user);
						res.render('./views/browse/browseProfil');
					})
					.then((photosUser) => {
						infos.photos = photosUser;

						return BrowseModel.getAllTagsUser(user);
					})
					.then((tags) => {
						infos.tags = tags;

						return UserModel.getTagsInDb(req.session.user.id);
					})
					.then((retTags) => {
						for (let i = 0; i < retTags.tags.length; i++) {
							retTags.check[i].idTag = retTags.tags[i].id;
							for (let j = 0; j < retTags.tags_user.length; j++) {
								if (retTags.tags[i].tag === retTags.tags_user[j].tag) {
									retTags.check[i].check = true;
									j = retTags.tags_user.length;
								} else {
									retTags.check[i].check = false;
								}
							}
						}
						infos.retTags = retTags;
						return UserModel.getPhotoProfil(req.session.user.id);
					})
					.then((photoUserSession) => {
						infos.photosProfil = photoUserSession.photosProfil;

						res.render('./views/browse/browseProfil', {
							title: 'En détail ...',
							profil: infos.infos[0],
							photos: infos.photos,
							tagsUser2: infos.tags,
							tags: infos.retTags.tags,
							tagsUser: infos.retTags.tags_user,
							check: infos.retTags.check,
							lat: infos.infos[0].lat,
							lng: infos.infos[0].lng,
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

	searchPostRoute() {
		this.router.post('/search/Change-Filters-Trie', (req, res) => {
			let profils = [],
				valueReq = req.body.data;

			BrowseModel.getInfosAllProfils(req.session.user.id)
				.then((infos) => {
					profils.infos = infos;
					return BrowseModel.getAllPhotosProfils(req.session.user.id);
				})
				.then((photos) => {
					profils.photos = photos;
					return BrowseModel.getInfosUserSession(req.session.user.id);
				})
				.then((infosUserSession) => {
					profils.infosUserSession = infosUserSession;
					if (valueReq === 'ASC') {
						return BrowseModel.filterProfilsOrderByDistance(
							req.session.user.id,
							profils.infosUserSession,
							'ASC',
							'zone',
							null,
							'noUsersWithZoneSize',
							'trie'
						);
					} else if (valueReq === 'DESC') {
						return BrowseModel.filterProfilsOrderByDistance(
							req.session.user.id,
							profils.infosUserSession,
							'DESC',
							'zone',
							null,
							'noUsersWithZoneSize',
							'trie'
						);
					} else if (valueReq === 'TAGS') {
						return BrowseModel.filterProfilsOrderByDistance(
							req.session.user.id,
							profils.infosUserSession,
							'ASC',
							'TAGS',
							null,
							'noUsersWithZoneSize',
							'trie'
						);
					} else if (valueReq === 'POP') {
						return BrowseModel.filterProfilsOrderByDistance(
							req.session.user.id,
							profils.infosUserSession,
							'ASC',
							'POP',
							null,
							'noUsersWithZoneSize',
							'trie'
						);
					} else if (valueReq === 'AgeASC') {
						return BrowseModel.filterProfilsOrderByDistance(
							req.session.user.id,
							profils.infosUserSession,
							'ASC',
							'AgeASC',
							null,
							'noUsersWithZoneSize',
							'trie'
						);
					} else if (valueReq === 'AgeDESC') {
						return BrowseModel.filterProfilsOrderByDistance(
							req.session.user.id,
							profils.infosUserSession,
							'ASC',
							'AgeDESC',
							null,
							'noUsersWithZoneSize',
							'trie'
						);
					} else if (valueReq === 'TOP') {
						return BrowseModel.filterProfilsOrderByDistance(
							req.session.user.id,
							profils.infosUserSession,
							'ASC',
							null,
							null,
							'noUsersWithZoneSize',
							null
						);
					}
				})
				.then((profilsOrder) => {
					profils.profilsOrder = profilsOrder;

					const response = {
						infos: profils.infos,
						photos: profils.photos,
						profilsOrder: profils.profilsOrder
					};
					Helper.sendResponseToClient(response, 0, res);
				})
				.catch((err) => {
					console.error(err);
					Helper.sendResponseToClient('Something went wrong!', 1, res);
				});
		});

		this.router.post('/search/Change-Filters-Intervals', (req, res) => {
			let profils = [];

			BrowseModel.getInfosAllProfils(req.session.user.id)
				.then((infos) => {
					profils.infos = infos;
					return BrowseModel.getInfosUserSession(req.session.user.id);
				})
				.then((infosUserSession) => {
					profils.infosUserSession = infosUserSession;
					return BrowseModel.filterProfilsOrderByDistance(
						req.session.user.id,
						profils.infosUserSession,
						'ASC',
						'zone',
						null,
						'noUsersWithZoneSize',
						null
					);
				})
				.then((profilsOrder) => {
					profils.profilsOrder = profilsOrder;
					return BrowseModel.getMinMaxValForSlidersIntervals(profilsOrder);
				})
				.then((minMaxVal) => {
					const response = {
						minMax: minMaxVal
					};
					Helper.sendResponseToClient(response, 0, res);
				})
				.catch((err) => {
					console.error(err);
					Helper.sendResponseToClient('Something went wrong!', 1, res);
				});
		});

		this.router.post('/search/New-Users-Filters-Intervals', (req, res) => {
			let profils = [],
				minMax = req.body;

			BrowseModel.getInfosAllProfils(req.session.user.id)
				.then((infos) => {
					profils.infos = infos;
					return BrowseModel.getAllPhotosProfils(req.session.user.id);
				})
				.then((photos) => {
					profils.photos = photos;
					return BrowseModel.getInfosUserSession(req.session.user.id);
				})
				.then((infosUserSession) => {
					profils.infosUserSession = infosUserSession;
					return BrowseModel.filterProfilsOrderByDistance(
						req.session.user.id,
						profils.infosUserSession,
						'ASC',
						'zone',
						minMax,
						'noUsersWithZoneSize',
						null
					);
				})
				.then((profilsOrder) => {
					profils.profilsOrder = profilsOrder;
					const response = {
						infos: profils.infos,
						photos: profils.photos,
						profilsOrder: profils.profilsOrder
					};

					if (profilsOrder.length) {
						Helper.sendResponseToClient(response, 0, res);
					} else {
						response.mess = 'Aucun utilisateurs trouvé avec ces intervals !';
						Helper.sendResponseToClient(response, 1, res);
					}
				})
				.catch((err) => {
					console.error(err);
					Helper.sendResponseToClient('Something went wrong!', 1, res);
				});
		});

		this.router.post('/search/Click-tag', (req, res) => {
			let tagsArray = req.body.data,
				profils = [];

			BrowseModel.getInfosAllProfils(req.session.user.id)
				.then((infos) => {
					profils.infos = infos;
					return BrowseModel.getAllPhotosProfils(req.session.user.id);
				})
				.then((photos) => {
					profils.photos = photos;
					return BrowseModel.getInfosUserSession(req.session.user.id);
				})
				.then((infosUserSession) => {
					profils.infosUserSession = infosUserSession;
					return BrowseModel.filterProfilsOrderByDistance(
						req.session.user.id,
						infosUserSession,
						'ASC',
						null,
						null,
						'noUsersWithZoneSize',
						null,
						tagsArray
					);
				})
				.then((profilsOrder) => {
					let response = {
						infos: profils.infos,
						photos: profils.photos,
						profilsOrder: profilsOrder
					};

					if (profilsOrder !== false && profilsOrder.length > 0) {
						Helper.sendResponseToClient(response, 0, res);
					} else {
						let pluriels = tagsArray.length > 1 ? true : false;

						response.mess = pluriels
							? 'Aucun utilisateurs avec vos critères de recherche ne correspond a ces tags'
							: 'Aucun utilisateurs avec vos critères de recherche ne correspond a ce tag';
						Helper.sendResponseToClient(response, 1, res);
					}
				})
				.catch((err) => {
					console.error(err);
					Helper.sendResponseToClient('Something went wrong!', 1, res);
				});
		});
	}
}
module.exports = SearchController;
