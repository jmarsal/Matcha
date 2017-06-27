/**
 * Created by jbmar on 30/04/2017.
 */

const Helper = require('../core/Helpers');
const UserModel = require('../models/UserModel');

const express = require('express');
const fs = require('fs');
const uniqid = require('uniqid');
const makeDir = require('make-dir');
const path = require('path');
const del = require('del');
const multer = require('multer');
const _ = require('lodash');
const Storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './public/profils/' + req.session.user.id);
	},
	filename: function(req, file, callback) {
		callback(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
	}
});

class AccountController {
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
		this.accountRoute();
		this.accountPostRoute();
	}

	accountRoute() {
		this.router.get('/account', (req, res) => {
			let infosUser = '',
				photosUsers = null,
				photos = null;

			if (req.session.start) {
				makeDir('./public/profils/' + req.session.user.id);
				UserModel.getInfoProfil(req.session.user.id)
					.then((infos) => {
						if (infos !== false) {
							infosUser = infos;
							return UserModel.getPhotoProfil(req.session.user.id);
						}
					})
					.then((status) => {
						if (status !== false) {
							photos = status;
							photosUsers = new Object();
							for (let i = 0; i < status.photos.length; i++) {
								photosUsers[i] = status.photos[i];
							}
						}
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
								retTags.tags[i].tag = _.unescape(retTags.tags[i].tag);
							}
						}
						req.session.user.photoFav = photos.photosProfil;
						res.render('./views/account/accountContent.pug', {
							photosUsers: photosUsers,
							photoFav: photos ? photos.photosProfil : '',
							email: infosUser.email,
							login: _.unescape(infosUser.login),
							name: _.unescape(infosUser.nom),
							firstName: _.unescape(infosUser.prenom),
							sex: infosUser.sex,
							orientation: infosUser.orientation,
							bio: infosUser.bio ? _.unescape(infosUser.bio) : '',
							tags: retTags.tags,
							tagsUser: retTags.tags_user,
							check: retTags.check,
							address: infosUser.address ? _.unescape(infosUser.address) : '',
							lat: infosUser.lat,
							lng: infosUser.lng,
							birthday: infosUser.birthday,
							nbNotif: infosUser.notifications
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

	accountPostRoute() {
		this.router.post('/account/Upload', (req, res) => {
			const upload = multer({
				storage: Storage,
				limits: { fileSize: 5000000 },
				fileFilter: (req, file, cb) => {
					if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
						Helper.sendResponseToClient("Le fichier n'est un jpg, png, ou gif !", 1, res);
					} else {
						cb(null, true);
					}
				}
			}).single('photos-profil'); //Field name and max count
			upload(req, res, (err) => {
				if (err) {
					if (err.toString().indexOf('Error: File too large') > -1) {
						Helper.sendResponseToClient("L'image est trop volumineuse ! (max: 5Mo)", 1, res);
					} else {
						console.error(err);
						Helper.sendResponseToClient('Something went wrong!', 1, res);
					}
				} else {
					if (!req.file) {
						Helper.sendResponseToClient('Il faut choisir une photo avant !', 1, res);
					} else {
						const src_photo = req.file.destination.replace('./public', '') + '/' + req.file.filename,
							data = {
								id_user: req.session.user.id,
								src_photo: src_photo
							};
						let id_user = '';
						UserModel.addPhotoProfil(data)
							.then(() => {
								return UserModel.getIdPhotoProfil(src_photo);
							})
							.then((id) => {
								id_user = id;

								return UserModel.checkIfNeedingToPutPhotoFav(req.session.user.id);
							})
							.then((status) => {
								if (id_user !== false) {
									const response = {
										mess: 'La photo est enregistrée!',
										srcPhoto: src_photo,
										idPhoto: id_user[0].id,
										fav: status === true ? 1 : 0
									};
									Helper.sendResponseToClient(response, 0, res);
								}
							})
							.catch((err) => {
								if (err) {
									console.error(err);
								}
							});
					}
				}
			});
		});
		this.router.post('/account/Delete', (req, res) => {
			UserModel.removePhotoById(req.body.id)
				.then((srcToRemove) => {
					del([ srcToRemove.replace('/profils', './public/profils') ])
						.then((path) => {
							return UserModel.modifyPhotoFavForConnect(req.session.user.id, null);
						})
						.then(() => {
							Helper.sendResponseToClient('photo supprimée!', 0, res);
						})
						.catch((err) => {
							console.error(err);
						});
				})
				.catch((err) => {
					console.error(err);
					Helper.sendResponseToClient('La suppression a rencontrée un problème!', 1, res);
				});
		});
		this.router.post('/account/Favorite', (req, res) => {
			let favorite = [];

			UserModel.updateFavoritePhotoById(req.body.id, req.session.user.id)
				.then((fav) => {
					favorite = fav;
					req.session.user.photoFav = favorite.src;
					return UserModel.modifyPhotoForNotifications(req.session.user.id, favorite);
				})
				.then(() => {
					return UserModel.modifyPhotoForConnect(req.session.user.id, favorite);
				})
				.then(() => {
					Helper.sendResponseToClient(favorite, 0, res);
				})
				.catch((err) => {
					console.error(err);
					Helper.sendResponseToClient('Problème de photo!', 1, res);
				});
		});
		this.router.post('/account/Modify-Profil', (req, res) => {
			const input = req.body.input,
				data = req.body.data;

			if (input === 'email') {
				// check email
				if (Helper.isEmail(data)) {
					let resData = {
						mess: 'Email modifié !',
						input: input,
						data: data
					};
					UserModel.modifyEmailByUserId(req.session.user.id, data)
						.then(() => {
							Helper.sendResponseToClient(resData, 0, res);
						})
						.catch((err) => {
							console.error(err);
							resData.mess = "Une erreur s'est produite!";
							Helper.sendResponseToClient(resData, 1, res);
						});
				} else {
					let resData = {
						mess: 'Email non valide !',
						input: input
					};
					Helper.sendResponseToClient(resData, 1, res);
				}
			} else if (input === 'login') {
				// check login
				if (data.length >= 3 && data.length <= 16) {
					const newLogin = _.escape(data).trim();
					let resData = {
						mess: 'Login modifié !',
						input: input,
						data: newLogin
					};
					UserModel.modifyLoginByUserId(req.session.user.id, newLogin)
						.then(() => {
							Helper.sendResponseToClient(resData, 0, res);
						})
						.catch((err) => {
							resData.mess = "Une erreur s'est produite!";
							Helper.sendResponseToClient(resData, 1, res);
						});
				} else {
					let resData = {
						mess: 'La taille du login doit etre entre 3 et 16 caractères',
						input: input
					};
					Helper.sendResponseToClient(resData, 1, res);
				}
			} else if (input === 'name') {
				// check lastName
				if (data.length >= 1 && data.length <= 255) {
					const newName = _.escape(data).trim();
					let resData = {
						mess: 'Nom modifié !',
						input: input,
						data: newName
					};
					UserModel.modifyFirstNameByUserId(req.session.user.id, newName)
						.then(() => {
							Helper.sendResponseToClient(resData, 0, res);
						})
						.catch((err) => {
							console.error(err);
							resData.mess = "Une erreur s'est produite!";
							Helper.sendResponseToClient(resData, 1, res);
						});
				} else {
					let resData = {
						mess: 'Votre nom doit être renseigné !',
						input: input
					};
					Helper.sendResponseToClient(resData, 1, res);
				}
			} else if (input === 'firstName') {
				// check firstName
				if (data.length >= 1 && data.length <= 255) {
					const newFirstName = _.escape(data).trim();
					let resData = {
						mess: 'Prénom modifié !',
						input: input,
						data: newFirstName
					};
					UserModel.modifyLastNameByUserId(req.session.user.id, newFirstName)
						.then(() => {
							Helper.sendResponseToClient(resData, 0, res);
						})
						.catch((err) => {
							console.error(err);
							resData.mess = "Une erreur s'est produite!";
							Helper.sendResponseToClient(resData, 1, res);
						});
				} else {
					let resData = {
						mess: 'Votre prénom doit être renseigné !',
						input: input
					};
					Helper.sendResponseToClient(resData, 1, res);
				}
			} else if (input === 'birthday') {
				// check birthday
				if (Helper.isValidDate(data)) {
					let resData = {
						mess: 'Date de naissance modifié !',
						input: input,
						data: data.date
					};
					UserModel.modifyBirthdayByUserId(req.session.user.id, data.date)
						.then(() => {
							Helper.sendResponseToClient(resData, 0, res);
						})
						.catch((err) => {
							console.error(err);
							resData.mess = "Une erreur s'est produite!";
							Helper.sendResponseToClient(resData, 1, res);
						});
				} else {
					let resData = {
						mess: "Votre date de naissance doit être renseigné ou n'est pas correct!",
						input: input
					};
					Helper.sendResponseToClient(resData, 1, res);
				}
			} else if (input === 'sex') {
				// check firstName
				if (data == 1 || data == 2) {
					let resData = {
						mess: data == 1 ? 'Tu es un homme 👱🏼' : 'Tu es une femme 👩🏼',
						input: input,
						data: data
					};
					UserModel.modifySexByUserId(req.session.user.id, data)
						.then(() => {
							Helper.sendResponseToClient(resData, 0, res);
						})
						.catch((err) => {
							console.error(err);
							resData.mess = "Une erreur s'est produite!";
							Helper.sendResponseToClient(resData, 1, res);
						});
				}
			} else if (input === 'orientation') {
				// check firstName
				if (data >= 1 && data <= 3) {
					UserModel.getSexByUserId(req.session.user.id)
						.then((sex) => {
							let mess = '';
							if (data == 3) {
								if (sex == 1) {
									mess = 'Tu es bisexuel 💑👨‍❤️‍👨';
								} else {
									mess = 'Tu es bisexuel 👩‍❤️‍👩💑';
								}
							} else if ((data == 1 && sex == 1) || (data == 2 && sex == 2)) {
								if (sex == 1) {
									mess = 'tu es homosexuel 👨‍❤️‍👨';
								} else {
									mess = 'tu es homosexuel 👩‍❤️‍👩';
								}
							} else {
								mess = 'tu es heterosexuel 💑';
							}
							let resData = {
								mess: mess,
								input: input,
								data: data
							};
							UserModel.modifyOrientationByUserId(req.session.user.id, data)
								.then(() => {
									Helper.sendResponseToClient(resData, 0, res);
								})
								.catch((err) => {
									console.error(err);
									resData.mess = "Une erreur s'est produite!";
									Helper.sendResponseToClient(resData, 1, res);
								});
						})
						.catch((err) => {
							Helper.sendResponseToClient({ mess: "Une erreur s'est produite!" }, 1, res);
						});
				}
			} else if (input === 'bio') {
				// check bio
				if (data.length >= 1 && data.length <= 21844) {
					const newBio = _.escape(data).trim();
					let resData = {
						mess: 'Ta bio est bien modifiée !',
						input: input,
						data: newBio
					};
					UserModel.modifyBioByUserId(req.session.user.id, newBio)
						.then(() => {
							resData.data = _.unescape(resData.data);
							Helper.sendResponseToClient(resData, 0, res);
						})
						.catch((err) => {
							console.error(err);
							resData.mess = "Une erreur s'est produite!";
							Helper.sendResponseToClient(resData, 1, res);
						});
				}
			}
		});
		this.router.post('/account/Add-tag', (req, res) => {
			const data = req.body.data;
			if (data.length >= 1 && data.length <= 150) {
				const newTag = _.escape(data).trim();
				let resData = {
					mess: 'Tag ajouté !',
					data: newTag,
					id: ''
				};
				UserModel.addNewTag(req.session.user.id, newTag)
					.then((retIdTag) => {
						if (retIdTag !== false) {
							resData.id = retIdTag;
							resData.data = _.unescape(resData.data);
							Helper.sendResponseToClient(resData, 0, res);
						} else {
							resData.mess = 'Le tag #' + newTag + ' existe déjà !';
							Helper.sendResponseToClient(resData, 1, res);
						}
					})
					.catch((err) => {
						console.error(err);
						resData.mess = "Une erreur s'est produite!";
						Helper.sendResponseToClient(resData, 1, res);
					});
			}
		});
		this.router.post('/account/Click-tag', (req, res) => {
			let resData = {
				mess: '',
				insertOrDelette: false
			};
			UserModel.modifyTagUserByTag(req.session.user.id, req.body.data)
				.then((status) => {
					if (status) {
						resData.mess = 'Le tag #' + req.body.data + ' ne fait plus parti de vos tags!';
						resData.insertOrDelette = true;
						Helper.sendResponseToClient(resData, 0, res);
					} else {
						resData.mess = 'Le tag #' + req.body.data + ' est ajouter à vos tags!';
						Helper.sendResponseToClient(resData, 0, res);
					}
				})
				.catch((err) => {
					console.error(err);
					resData.mess = "Une erreur s'est produite!";
					Helper.sendResponseToClient(resData, 1, res);
				});
		});
		this.router.post('/account/Get-location', (req, res) => {
			let resData = {
				mess: '',
				data: req.body
			};
			console.log(req.body);
			UserModel.addLocationProfil(req.body, req.session.user.id).catch((err) => {
				console.error(err);
				resData.mess = "Une erreur s'est produite!";
				Helper.sendResponseToClient(resData, 1, res);
			});
		});

		this.router.post('/account/Update-tags', (req, res) => {
			let resData = {
				mess: '',
				tagsUser: '',
				tags: '',
				check: ''
			};
			UserModel.getTagsInDb(req.session.user.id)
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
					resData.tagsUser = retTags.tags_user;
					resData.tags = retTags.tags;
					resData.check = retTags.check;
					Helper.sendResponseToClient(resData, 0, res);
				})
				.catch((err) => {
					console.error(err);
					resData.mess = "Une erreur s'est produite!";
					Helper.sendResponseToClient(resData, 1, res);
				});
		});
	}
}
module.exports = AccountController;
