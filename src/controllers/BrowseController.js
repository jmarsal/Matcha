/**
 * Created by jbmar on 30/04/2017.
 */

const express = require('express');

const BrowseModel = require('../models/BrowseModel'),
    UserModel = require('../models/UserModel')
;

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
            if (req.session.start) {
                let profils = [];

                BrowseModel.getInfosAllProfils(req.session.user.id)
                    .then((infos) => {
                        profils.infos = infos;
                        return BrowseModel.getAllPhotosProfils(req.session.user.id);
                    })
                    .then((photos) => {
                        profils.photos = photos;
                        return BrowseModel.getInfosUserSession(req.session.user.id);
                    })
                    .then((infosUserSession) => {
                        profils.infosUserSession = infosUserSession;
                        return BrowseModel.updateDistanceFromUserAndtheOther(profils.infos, infosUserSession)
                    })
                    .then(() => {
                        return BrowseModel.getCommunTagsByUsers(req.session.user.id);
                    })
                    .then(() => {
                        return UserModel.getPhotoProfil(req.session.user.id);
                    })
                    .then((photoUserSession) => {
                        profils.photosProfil = photoUserSession.photosProfil;
                        return BrowseModel.filterProfilsOrderByDistance(req.session.user.id, profils.infosUserSession);
                    })
                    .then((profilsOrder) => {
                        res.render('./views/browse/browseContent', {
                            title: "Voici quelques profils qui pourrait te convenir ...",
                            profils: profilsOrder,
                            photos: profils.photos,
                            photoFav: (profils.photosProfil ? profils.photosProfil : ""),
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