/**
 * Created by jbmar on 30/04/2017.
 */

const express = require('express');
const uniqid = require('uniqid');
const _ = require('lodash');

const UserModel = require('../models/UserModel');
const Helpers = require('../core/Helpers');
const Mails = require('../core/Mails');

class AccueilController {
	constructor() {
		this.login = '';
		this.lastName = '';
		this.firstName = '';
		this.email = '';
		this.password = '';
		this.repPassword = '';

		if (!app) {
			console.error('Error! Exiting... You must provide the Express instance to controllers.');
			process.exit(1);
		}

		this.router = express.Router();
		this.registerRoutes();
		app.use('/', this.router);
	}

	registerRoutes() {
		this.accueilRoute();
		this.loginRoute();
		this.logonRoute();
		this.forgetPasswdRoute();
		this.reinitPasswdRoute();
	}

	accueilRoute() {
		this.router.get('/', (req, res) => {
			if (!req.session.start) {
				res.redirect('./accueil/');
			} else {
				res.redirect('./browse');
			}
		});
		this.router.get('/accueil', (req, res) => {
			if (req.session.start) {
				req.session.destroy(function(err) {
					console.error(err);
				});
			}
			res.render('views/accueil/accueilContent');
		});
	}

	/*
     ** page de connection
     */
	loginRoute() {
		this.router.get('/login', (req, res) => {
			if (!req.session.start) {
				let getDataUrl = '',
					getLogin = '',
					getKey = '';

				Helpers.parseURLParams(req.url)
					.then((get) => {
						getDataUrl = get;
						if (
							(getLogin = getDataUrl.log.toString()) !== '' &&
							(getKey = getDataUrl.cle.toString()) !== ''
						) {
							//Modification de la cle dans la DB
							UserModel.changeKey(getLogin, getKey)
								.then((status) => {
									// Si tout c'est bien passe
									if (status) {
										res.render('views/accueil/loginContent');
									} else {
										//La cle du mail ne correspond pas a celle du login dans la DB
										res.render('views/accueil/loginContent', {
											error: 'Votre compte est deja actif !'
										});
									}
								})
								.catch((err) => {
									//Pb de connection
									res.render('views/accueil/loginContent', {
										error: "Une erreur s'est produite! Vous n'avez pas pu activer votre compte..."
									});
								});
						} else {
							//Il manque de la data depuis le link du mail
							console.error("Probleme de data dans l'url");
							res.render('views/accueil/loginContent', {
								error: "Une erreur s'est produite! Vous n'avez pas pu activer votre compte..."
							});
						}
					})
					.catch(() => {
						//Page login sans arriver du mail
						res.render('views/accueil/loginContent');
					});
			} else {
				res.redirect('./account');
			}
		});

		this.router.post('/login/form', (req, res) => {
			if (this.checkFormLogin(req, res)) {
				let dataUser = {
					login: _.escape(this.login),
					passwd: Helpers.hashString(this.password, 'sha512')
				};

				UserModel.checkUserForLogin(dataUser)
					.then((status) => {
						if (status === true) {
							req.session.start = 1;
							UserModel.getIdbyLogin(this.login)
								.then((status) => {
									if (status !== false) {
										req.session.user = { login: this.login, id: status };
										Helpers.sendResponseToClient(req.session.user, null, res, true, '../account/');
									} else {
										Helpers.sendResponseToClient("Une erreur s'est produite!", 1, res);
									}
								})
								.catch((err) => {
									if (err) {
										console.error(err);
									}
								});
						} else if (status === false) {
							Helpers.sendResponseToClient('Erreur de login et / ou mot de passe!', 1, res);
						} else {
							Helpers.sendResponseToClient(status, 1, res);
						}
					})
					.catch((err) => {
						console.error(err);
						Helpers.sendResponseToClient("Une erreur s'est produite!", 1, res);
					});
			}
		});
	}

	/*
     ** Page de creation de compte
     */
	logonRoute() {
		this.router.get('/logon', (req, res) => {
			if (!req.session.start) {
				res.render('views/accueil/logonContent');
			} else {
				res.redirect('./browse');
			}
		});
		this.router.post('/logon/form', (req, res) => {
			const mailSender = new Mails();
			let checkDone = false;

			if (this.checkFormRegister(req, res)) {
				let dataUser = {
					login: this.login,
					nom: this.lastName,
					prenom: this.firstName,
					email: this.email,
					passwd: Helpers.hashString(this.password, 'sha512'),
					cle: uniqid()
				};

				UserModel.newUser(dataUser)
					.then((status) => {
						if (status === true) {
							mailSender
								.mailNewUser(dataUser)
								.then((message) => {
									Helpers.sendResponseToClient('Votre compte est créé !', 0, res, true, '../login/');
									checkDone = true;
								})
								.catch((err) => {
									console.error(err);
									Helpers.sendResponseToClient("Une erreur s'est produite!", 1, res);
								});
						} else {
							Helpers.sendResponseToClient(status, 1, res);
						}
					})
					.catch((err) => {
						console.error(err);
						Helpers.sendResponseToClient("Une erreur s'est produite!", 1, res);
					});
			}
		});
	}

	/*
     ** Page d'oublie ou non activation de compte
     */
	forgetPasswdRoute() {
		this.router.get('/forget-passwd', (req, res) => {
			if (!req.session.start) {
				let getDataUrl = '',
					getLogin = '',
					getKey = '';

				Helpers.parseURLParams(req.url)
					.then((get) => {
						getDataUrl = get;
						if (
							(getLogin = getDataUrl.log.toString()) !== '' &&
							(getKey = getDataUrl.cle.toString()) !== ''
						) {
							//Modification de la cle dans la DB
							UserModel.changeKey(getLogin, getKey)
								.then((status) => {
									// Si tout c'est bien passe
									if (status) {
										this.login = getLogin;
										res.render('views/accueil/ReinitPasswdContent');
									} else {
										//La cle du mail ne correspond pas a celle du login dans la DB
										res.render('views/accueil/loginContent', {
											error: 'Votre compte est deja actif !'
										});
									}
								})
								.catch((err) => {
									//Pb de connection
									res.render('views/accueil/loginContent', {
										error: "Une erreur s'est produite! Vous n'avez pas pu activer votre compte..."
									});
								});
						} else {
							//Il manque de la data depuis le link du mail
							console.error("Probleme de data dans l'url");
							res.render('views/accueil/loginContent', {
								error: "Une erreur s'est produite! Vous n'avez pas pu activer votre compte..."
							});
						}
					})
					.catch(() => {
						//Page login sans arriver du mail
						res.render('views/accueil/forgetContent');
					});
			} else {
				res.redirect('./account');
			}
		});

		this.router.post('/forget-passwd/form', (req, res) => {
			if (this.checkFormForgetPass(req, res)) {
				let email = this.email,
					login = '',
					cle = '';

				UserModel.getLoginCleByEmail(email)
					.then((status) => {
						if (status !== false) {
							login = status.login;
							cle = status.cle;

							UserModel.checkEmailForForgetPasswd(email)
								.then((status) => {
									if (status) {
										const mailSender = new Mails();

										mailSender
											.mailReinitPasswd(email, login, cle)
											.then((message) => {
												Helpers.sendResponseToClient(
													'Un email vient de vous être envoyé !',
													0,
													res,
													true,
													'../login/'
												);
											})
											.catch((err) => {
												console.error(err);
												Helpers.sendResponseToClient("Une erreur s'est produite!", 1, res);
											});
									} else
										Helpers.sendResponseToClient(
											"Aucun compte n'est associé à cette addresse email !",
											1,
											res,
											true,
											'../logon/'
										);
								})
								.catch((err) => {
									console.error(err);
									Helpers.sendResponseToClient("Une erreur s'est produite!", 1, res);
								});
						} else {
							Helpers.sendResponseToClient(
								"Aucun compte n'est associé à cette addresse email !",
								1,
								res,
								true,
								'../logon/'
							);
						}
					})
					.catch((err) => {
						console.error(err);
						Helpers.sendResponseToClient("Une erreur s'est produite!", 1, res);
					});
			}
		});
	}

	/*
     ** Reinit du mot de passe
     */
	reinitPasswdRoute() {
		this.router.post('/reinit-passwd/form', (req, res) => {
			if (!req.session.start) {
				if (this.checkFormReinitPass(req, res)) {
					let dataUser = {
						login: this.login,
						passwd: Helpers.hashString(this.password, 'sha512')
					};

					UserModel.changePasswd(dataUser)
						.then((status) => {
							Helpers.sendResponseToClient(
								'Le mot de passe a bien été modifié !',
								0,
								res,
								true,
								'../login/'
							);
						})
						.catch((err) => {
							console.error(err);
							Helpers.sendResponseToClient("Une erreur s'est produite!", 1, res);
						});
				}
			} else {
				res.redirect('./account');
			}
		});
	}

	/*
     ** Verifie que tous les champs soit correctement remplis
     */
	checkFormRegister(req, res) {
		res.setHeader('Content-Type', 'application/json');

		if (this.checkJsonReq(req, res) == true) {
			// check login
			if (req.body.loginRegisterInput.length >= 3 && req.body.loginRegisterInput.length <= 16) {
				this.login = _.escape(req.body.loginRegisterInput).trim();
			} else {
				Helpers.sendResponseToClient('La taille du login doit etre entre 3 et 16 caractères', 1, res);
				return false;
			}
			// check lastName
			if (req.body.lastNameRegisterInput.length >= 1 && req.body.lastNameRegisterInput.length <= 255) {
				this.lastName = _.escape(req.body.lastNameRegisterInput).trim();
			} else {
				Helpers.sendResponseToClient('Votre nom doit être renseigné !', 1, res);
				return false;
			}
			// check firstName
			if (req.body.firstNameRegisterInput.length >= 1 && req.body.firstNameRegisterInput.length <= 255) {
				this.firstName = _.escape(req.body.firstNameRegisterInput).trim();
			} else {
				Helpers.sendResponseToClient('Votre prénom doit être renseigné !', 1, res);
				return false;
			}
			// check email
			if (Helpers.isEmail(req.body.emailRegisterInput)) {
				this.email = req.body.emailRegisterInput;
			} else {
				Helpers.sendResponseToClient('Email non valide !', 1, res);
				return false;
			}
			// check password
			if (
				req.body.passwdRegisterInput.length >= 8 &&
				req.body.passwdRegisterInput.length <= 255 &&
				req.body.passwdRegisterInput.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
			) {
				this.password = req.body.passwdRegisterInput;
			} else {
				Helpers.sendResponseToClient(
					'Mot de passe non valide ! Il doit contenir 8 caracteres avec majuscule, minuscule, numerique.',
					1,
					res
				);
				return false;
			}
			return true;
		} else {
			return false;
		}
	}

	/*
     ** Verifie que les champs du formulaire ne soit pas vide.
     */
	checkFormLogin(req, res) {
		res.setHeader('Content-Type', 'application/json');

		if (this.checkJsonReq(req, res) == true) {
			if (req.body.loginRegisterInput.length >= 3 && req.body.loginRegisterInput.length <= 16) {
				this.login = _.escape(req.body.loginRegisterInput).trim();
			} else {
				Helpers.sendResponseToClient("Ce login n'existe pas !", 1, res);
				return false;
			}
			if (
				req.body.passwdRegisterInput.length >= 8 &&
				req.body.passwdRegisterInput.length <= 255 &&
				req.body.passwdRegisterInput.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
			) {
				this.password = req.body.passwdRegisterInput;
			} else {
				Helpers.sendResponseToClient('Mot de passe non valide !', 1, res);
				return false;
			}
			return true;
		} else {
			return false;
		}
	}

	/*
     ** Verifie que les champs du formulaire ne soit pas vide.
     */
	checkFormForgetPass(req, res) {
		res.setHeader('Content-Type', 'application/json');

		if (this.checkJsonReq(req, res) == true) {
			// check email
			if (Helper.isEmail(req.body.emailRegisterInput)) {
				this.email = req.body.emailRegisterInput;
				return true;
			} else {
				Helpers.sendResponseToClient('Email non valide !', 1, res);
				return false;
			}
		}
	}

	checkFormReinitPass(req, res) {
		res.setHeader('Content-Type', 'application/json');

		if (this.checkJsonReq(req, res) == true) {
			if (
				req.body.passwdRegisterInput.length >= 8 &&
				req.body.passwdRegisterInput.length <= 255 &&
				req.body.passwdRegisterInput.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
			) {
				this.password = req.body.passwdRegisterInput;
			} else {
				Helpers.sendResponseToClient(
					'Mot de passe non valide ! Il doit contenir 8 caracteres avec majuscule, minuscule, numerique.',
					1,
					res
				);
				return false;
			}
			if (
				req.body.repPasswdRegisterInput.length >= 8 &&
				req.body.repPasswdRegisterInput.length <= 255 &&
				req.body.repPasswdRegisterInput.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
			) {
				this.repPassword = req.body.repPasswdRegisterInput;
			} else {
				Helpers.sendResponseToClient(
					'La vérification du mot de passe est non valide ! Il doit contenir 8 caracteres avec majuscule, minuscule, numerique.',
					1,
					res
				);
				return false;
			}
			if (this.password === this.repPassword) {
				return true;
			} else {
				Helpers.sendResponseToClient('Les deux mots de passe ne sont pas identiques !', 1, res);
				return false;
			}
		}
	}

	/*
     **  Verifie que les champs du formulaire ne soit pas vide.
     */
	checkJsonReq(req, res) {
		let countEmptyValues = 0,
			i = 0,
			nbElems = 0;
		for (i in req.body) {
			if (req.body[i] === '') {
				countEmptyValues++;
			}
			nbElems++;
		}
		if (nbElems === countEmptyValues && countEmptyValues > 1) {
			Helpers.sendResponseToClient('Veuillez renseigner tous les champs!', 1, res);
			return false;
		} else if (nbElems === countEmptyValues && countEmptyValues === 1) {
			Helpers.sendResponseToClient('Veuillez renseigner un email!', 1, res);
			return false;
		}
		return true;
	}
}
module.exports = AccueilController;
