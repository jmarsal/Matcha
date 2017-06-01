/**
 * Created by jbmar on 30/04/2017.
 */

const express = require('express');

const BrowseModel = require('../models/BrowseModel');

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

                BrowseModel.getInfosAllProfils(req.session.user.id)
                    .then((infos) => {
                        profils.infos = infos;
                        return BrowseModel.getAllPhotosProfils(req.session.user.id);
                    })
                    .then((photos) => {
                        profils.photos = photos;
                        return BrowseModel.getaddressUserSession(req.session.user.id);
                    })
                    .then((addressUserSession) => {
                        return BrowseModel.updateDistanceFromUserAndtheOther(req.session.user.id, profils.infos, addressUserSession)
                    })
                    .then((distances) => {
                        res.render('./views/browse/browseContent', {
                            title: "Voici quelques profils qui pourrait te convenir ...",
                            profils: profils.infos,
                            photos: profils.photos
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                    })
            } else {
                res.redirect('../accueil');
            }
        });
    }
}
module.exports = BrowseController;