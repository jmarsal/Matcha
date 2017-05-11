/**
 * Created by jbmar on 30/04/2017.
 */

const express = require('express');
const validator = require('validator');
const UserModel = require('../models/UserModel');
const crypto = require('crypto');
const uniqid = require('uniqid');
const nodemailer = require('nodemailer');

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
    }


    accueilRoute() {
        this.router.get('/', (req, res) => {
            res.redirect('./accueil/');
        });
        this.router.get('/accueil', (req, res) => {
            res.render('views/accueil/accueilContent');
        });
        this.router.get('/login', (req, res) => {
            res.render('views/accueil/loginContent');
        });
        this.router.get('/logon', (req, res) => {
            res.render('views/accueil/logonContent');
        });
        this.router.post('/logon/form', (req, res) => {
            if (this.checkFormRegister(req, res)) {
                let dataUser = {
                    "login": this.login,
                    "nom": this.lastName,
                    "prenom": this.firstName,
                    "email": this.email,
                    "passwd": this.hashString(this.password, 'sha512'),
                    "cle": uniqid()
                }

                UserModel.newUser(dataUser)
                .then((status) => {
                    if (status){
                        let transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'jmarsal.matcha@gmail.com',
                                pass: 'antoine&justine'
                            }
                        });

                        let mailOptions = {
                            from: '"EnMarche" <foo@matcha.com>', // sender address
                            to: 'jb.marsal@gmail.com, jmarsal@student.42.fr', // list of receivers
                            subject: 'Hello ✔', // Subject line
                            text: 'Hello world ?', // plain text body
                            html: '<b>Hello world ?</b>' // html body
                        };

                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message %s sent: %s', info.messageId, info.response);
                        });
                    }
                    status ?
                        this.sendResponseToClient("Votre compte est créé !", 0, res) :
                        this.sendResponseToClient("Un compte existe déjà pour cette adresse mail !", 1, res)
                    ;
                }).catch((error) => {
                    console.error(error);
                    this.sendResponseToClient("Une erreur s'est produite!", 1, res);
                });
            }
        });
    }

/*
 ** Verifie que tous les champs soit correctement remplis
 */
checkFormRegister(req, res)
{
    res.setHeader('Content-Type', 'application/json');

    if ((this.checkJsonReq(req, res)) == true) {
        // check login
        if (validator.isLength(req.body.loginRegisterInput, {min: 3, max: 16})) {
            this.login = validator.escape(req.body.loginRegisterInput).trim();
        } else {
            this.sendResponseToClient("La taille du login doit etre entre 3 et 16 caractères", 1, res);
            return false;
        }
        // check lastName
        if (validator.isLength(req.body.lastNameRegisterInput, {min: 1, max: 255})) {
            this.lastName = validator.escape(req.body.lastNameRegisterInput).trim();
        } else {
            this.sendResponseToClient("Votre nom doit être renseigné !", 1, res);
            return false;
        }
        // check firstName
        if (validator.isLength(req.body.firstNameRegisterInput, {min: 1, max: 255})) {
            this.firstName = validator.escape(req.body.firstNameRegisterInput).trim();
        } else {
            this.sendResponseToClient("Votre prénom doit être renseigné !", 1, res);
            return false;
        }
        // check email
        if (validator.isEmail(req.body.emailRegisterInput)) {
            this.email = req.body.emailRegisterInput;
            console.log(this.email);
        } else {
            this.sendResponseToClient("Email non valide !", 1, res);
            return false;
        }
        // check password
        if (validator.isLength(req.body.passwdRegisterInput, {min: 8, max: 255}) &&
            req.body.passwdRegisterInput.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            this.password = req.body.passwdRegisterInput;
        } else {
            this.sendResponseToClient("Mot de passe non valide ! Il doit contenir 8 caracteres avec majuscule, minuscule, numerique.", 1, res);
            return false;
        }
        return true;
    } else {
        return false;
    }
}

/*
 **  Verifie que le JSON de la requete ne soit pas vide.
 */
checkJsonReq(req, res)
{
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
        this.sendResponseToClient("Veuillez renseigner tous les champs!", 1, res);
        return false;
    }
    return true;
}

/*
 **  envoie la reponse au client
 */
sendResponseToClient(responseMessage, isError, res)
{
    // responseMessage = (responseMessage === "") ? "Compte enregistré" : responseMessage;
    res.send(JSON.stringify({
        response: responseMessage,
        isErr: isError
    }, null, 3));
}

hashString(string, algo)
{
    let hash = crypto.createHash(algo),
        hashPass = hash.update(string, 'utf-8')
    ;
    return hashPass.digest('hex');
}
}
module.exports = AccueilController;