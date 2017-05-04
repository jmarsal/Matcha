/**
 * Created by jbmar on 29/04/2017.
 */

import express from 'express';
import path from 'path';
import http from 'http';

class Server {
    constructor() {
        global.app = express();

        app.set('httpServer', http.Server(app));
        this.port = 8080;
        app.set('views', path.join(__dirname, './src'));
        app.use(express.static(path.join(__dirname, '../../public')));

        //Si accueil
        app.get('/', (request, response) => {
            let accueilController = require('../controllers/AccueilController');
            accueilController.accueil(response);
        });
//Si App / Parcourir
        app.get('/Parcourir', (request, response) => {
            let appController = require('../controllers/AppController');
            appController.appParcourir(response);
        });
//Si Recherche
        app.get('/Recherche', (request, response) => {
            let rechercheController = require('../controllers/RechercheController');
            rechercheController.recherche(response);
        });
//Si ProfilUser
        app.get('/ProfilUser', (request, response) => {
            let profilUserController = require('../controllers/ProfilUserController');
            profilUserController.profilUser(response);
        });
//Si Mon Compte
        app.get('/Account', (request, response) => {
            let accountController = require('../controllers/AccountController');
            accountController.account(response);
        });
// Autre : 404
        app.use(function(request, response, next){
            let errorController = require('../controllers/404_Controller');
            errorController.p_404(response);
        });
    }

    listen() {
        app.get('httpServer').listen(this.port, () => {
            console.log(`Listening on port ${ this.port }`);
        });
    }
}

export default Server;