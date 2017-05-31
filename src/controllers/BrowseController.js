/**
 * Created by jbmar on 30/04/2017.
 */

const express = require('express');

class BrowseController {
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
        this.browseRoute();
    }

    browseRoute() {
        this.router.get('/browse', (req, res) => {
            if (req.session.start){
                let profils = [];
                res.render('./views/browse/browseContent', {
                    title: "Voici quelques profils qui pourrait te convenir ..."
                });
            } else {
                res.redirect('../accueil');
            }
        });
    }
}
module.exports = BrowseController;