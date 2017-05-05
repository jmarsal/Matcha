/**
 * Created by jbmar on 30/04/2017.
 */

const express = require('express');

class AccueilController {
    constructor() {
        if (!app) {
            console.error('Error! Exiting... You must provide the Express instance to controllers.');
            process.exit(1);
        }

        this.router = express.Router();
        this.registerRoutes();
        // app.use(subdomain('/', this.router));
    }

    registerRoutes() {
        this.accueilRoute();
        // this.trackPlayRoute();
        // this.latestRoute();
        // this.popularRoute();
        // this.artistRoute();
    }

    accueilRoute() {
        this.router.get('/', (request, response) => {
            console.log('router get ok');
            const pug = require('pug'),
                accueil = pug.renderFile('src/views/accueil/accueilContent.pug', {
                    title: 'Accueil !!!'
                })
            ;

            response.status(200).send(accueil);
        });
        this.router.get('/matcha', (request, response) => {
            console.log('router matcha ok');
            const pug = require('pug'),
                accueil = pug.renderFile('src/views/accueil/accueilContent.pug', {
                    title: 'Accueil !!!'
                })
            ;

            response.status(200).send(accueil);
        });
        app.use(function(request, response, next){
            const errorController = require('./404_Controller');
            errorController.p_404(response);
        });
    }
}
module.exports = AccueilController;
// function (response) {
// var pug = require('pug'),
//     accueil = pug.renderFile('src/views/accueil/accueilContent.pug', {
//         title: 'Accueil !!!'})
// ;
// response.status(200).send(accueil)
// };