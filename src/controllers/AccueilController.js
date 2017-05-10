/**
 * Created by jbmar on 30/04/2017.
 */

const express = require('express');
const validator = require('validator');

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
            this.checkFormRegister(req, res);
        });
    }

    checkFormRegister(req, res) {
        console.log(req.body);
        res.setHeader('Content-Type', 'application/json');
        var responseForm = "",
            error = 0
        ;

        if (validator.isLength(req.body.loginRegisterInput, {min:3, max:16})){
            this.login = trim(validator.escape(req.body.loginRegisterInput));
        } else {
            responseForm = "La taille du login doit etre entre 3 et 16 caractères";
            error = 1;
        }


        //check email
        if (validator.isEmail(req.body.emailRegisterInput)){
            this.email = req.body.emailRegisterInput;
        } else {
            responseForm = "Email non valide !";
            error = 1;
        }


        responseForm = (responseForm === "") ? "Compte enregistré" : responseForm;
        res.send(JSON.stringify({
            response: responseForm,
            isErr: error
        }, null, 3));
    //    gerer la validation des champs du form
    }
}
module.exports = AccueilController;