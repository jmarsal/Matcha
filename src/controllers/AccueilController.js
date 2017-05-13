/**
 * Created by jbmar on 30/04/2017.
 */

const express = require('express');
const validator = require('validator');
const uniqid = require('uniqid');

const UserModel = require('../models/UserModel');
const Helpers = require('../core/Helpers');
const Mails = require('../core/Mails');

class AccueilController {
    constructor() {
        this.login = "";
        this.lastName = "";
        this.firstName = "";
        this.email = "";
        this.password = "";

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
    }


    accueilRoute() {
        this.router.get('/', (req, res) => {
            res.redirect('./accueil/');
        });
        this.router.get('/accueil', (req, res) => {
            res.render('views/accueil/accueilContent');
        });
    }

    loginRoute() {
        this.router.get('/login', (req, res) => {
            res.render('views/accueil/loginContent');
        });
    }

    logonRoute() {
        this.router.get('/logon', (req, res) => {
            res.render('views/accueil/logonContent');
        });
        this.router.post('/logon/form', (req, res) => {
            const mailSender = new Mails();
            let checkDone = false;

            if (this.checkFormRegister(req, res)) {
                let dataUser = {
                    "login": this.login,
                    "nom": this.lastName,
                    "prenom": this.firstName,
                    "email": this.email,
                    "passwd": Helpers.hashString(this.password, 'sha512'),
                    "cle": uniqid()
                }

                UserModel.newUser(dataUser)
                    .then((status) => {
                        if (status) {
                            mailSender.mailNewUser(this.email, this.login)
                                .then((message) => {
                                    console.log(message);
                                    Helpers.sendResponseToClient("Votre compte est créé !", 0, res, true, '../login/');
                                    checkDone = true;
                                }).catch((err) => {
                                console.error(err);
                                Helpers.sendResponseToClient("Une erreur s'est produite!!!!", 1, res);
                            });
                        } else {
                            Helpers.sendResponseToClient("Un compte existe déjà pour cette adresse mail !", 1, res);
                        }
                    }).catch((error) => {
                    console.error(error);
                    Helpers.sendResponseToClient("Une erreur s'est produite!", 1, res);
                });
            }
        });
    }


    /*
     ** Verifie que tous les champs soit correctement remplis
     */
    checkFormRegister(req, res) {
        res.setHeader('Content-Type', 'application/json');

        if ((this.checkJsonReq(req, res)) == true) {
            // check login
            if (validator.isLength(req.body.loginRegisterInput, {min: 3, max: 16})) {
                this.login = validator.escape(req.body.loginRegisterInput).trim();
            } else {
                Helpers.sendResponseToClient("La taille du login doit etre entre 3 et 16 caractères", 1, res);
                return false;
            }
            // check lastName
            if (validator.isLength(req.body.lastNameRegisterInput, {min: 1, max: 255})) {
                this.lastName = validator.escape(req.body.lastNameRegisterInput).trim();
            } else {
                Helpers.sendResponseToClient("Votre nom doit être renseigné !", 1, res);
                return false;
            }
            // check firstName
            if (validator.isLength(req.body.firstNameRegisterInput, {min: 1, max: 255})) {
                this.firstName = validator.escape(req.body.firstNameRegisterInput).trim();
            } else {
                Helpers.sendResponseToClient("Votre prénom doit être renseigné !", 1, res);
                return false;
            }
            // check email
            if (validator.isEmail(req.body.emailRegisterInput)) {
                this.email = req.body.emailRegisterInput;
            } else {
                Helpers.sendResponseToClient("Email non valide !", 1, res);
                return false;
            }
            // check password
            if (validator.isLength(req.body.passwdRegisterInput, {min: 8, max: 255}) &&
                req.body.passwdRegisterInput.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
                this.password = req.body.passwdRegisterInput;
            } else {
                Helpers.sendResponseToClient("Mot de passe non valide ! Il doit contenir 8 caracteres avec majuscule, minuscule, numerique.", 1, res);
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    /*
     **  Verifie que les champs du formulaire ne soit pas vide.
     */
    checkJsonReq(req, res) {
        let countEmptyValues = 0,
            i = 0,
            nbElems = 0;
        ;

        for (i in req.body) {
            if (req.body[i] === "") {
                countEmptyValues++;
            }
            nbElems++;
        }
        if (nbElems == countEmptyValues) {
            Helpers.sendResponseToClient("Veuillez renseigner tous les champs!", 1, res);
            return false;
        }
        return true;
    }


}
module.exports = AccueilController;