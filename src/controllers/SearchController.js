/**
 * Created by jbmar on 30/04/2017.
 */
exports.recherche = function (response) {
    var pug = require('pug'),
        recherche = pug.renderFile('./views/accueil/browseContent.pug', {
            title: 'Recherche !!!'})
    ;

    response.status(200).send(recherche)
};

const express = require('express');

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
        this.accueilRoute();
    }

    accueilRoute() {
        this.router.get('/search', (req, res) => {
            res.render('./views/search/searchContent', {
                title: 'Recherche !!!'
            });
        });
    }
}
module.exports = SearchController;