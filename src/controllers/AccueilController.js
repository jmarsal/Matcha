/**
 * Created by jbmar on 30/04/2017.
 */

const express = require('express');
const bodyParser = require('body-parser');

class AccueilController {
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
            app.use(bodyParser.json(req));
            app.use(function (req, res) {
                // console.log(req);
                res.setHeader('Content-Type', 'application/json')
                res.write('you posted:\n')
                res.end(JSON.stringify(req.body, null, 2))
            })
            res.render('views/accueil/logonContent');
        });
    }
}
module.exports = AccueilController;