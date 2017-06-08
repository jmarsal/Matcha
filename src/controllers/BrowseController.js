/**
 * Created by jbmar on 30/04/2017.
 */

const express = require('express');

const BrowseModel = require('../models/BrowseModel'),
    UserModel = require('../models/UserModel'),
    Helper = require('../Core/Helpers')
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
        this.browsePostRoute();
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
                        return BrowseModel.updateDistanceFromUserAndtheOther(req.session.user.id, profils.infos, infosUserSession)
                    })
                    .then((distancesFromUsers) => {
                        profils.distances = distancesFromUsers;
                        return BrowseModel.getCommunTagsByUsers(req.session.user.id);
                    })
                    .then(() => {
                        return UserModel.getPhotoProfil(req.session.user.id);
                    })
                    .then((photoUserSession) => {
                        profils.photosProfil = photoUserSession.photosProfil;
                        return BrowseModel.filterProfilsOrderByDistance(req.session.user.id, profils.infosUserSession, "ASC");
                    })
                    .then((profilsOrder) => {
                        res.render('./views/browse/browseContent', {
                            title: "Voici quelques profils qui pourraient te convenir ...",
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

    browsePostRoute() {
        this.router.post("/browse/Change-Filters-Trie", (req, res) => {
            let profils = [],
                valueReq = req.body.data;
            ;

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
                    if (valueReq === 'ASC') {
                        return BrowseModel.filterProfilsOrderByDistance(req.session.user.id, profils.infosUserSession, "ASC");
                    } else if (valueReq === 'DESC') {
                        return BrowseModel.filterProfilsOrderByDistance(req.session.user.id, profils.infosUserSession, "DESC");
                    } else if (valueReq === 'TAGS') {
                        return BrowseModel.filterProfilsOrderByDistance(req.session.user.id, profils.infosUserSession, "ASC", 'TAGS');
                    } else if (valueReq === 'POP') {
                        return BrowseModel.filterProfilsOrderByDistance(req.session.user.id, profils.infosUserSession, "ASC", 'POP');
                    } else if (valueReq === 'AgeASC') {
                        return BrowseModel.filterProfilsOrderByDistance(req.session.user.id, profils.infosUserSession, "ASC", 'AgeASC');
                    } else if (valueReq === 'AgeDESC') {
                        return BrowseModel.filterProfilsOrderByDistance(req.session.user.id, profils.infosUserSession, "ASC", 'AgeDESC');
                    }
                })
                .then((profilsOrder) => {
                    profils.profilsOrder = profilsOrder;

                    const response = {
                        'infos': profils.infos,
                        'photos': profils.photos,
                        'profilsOrder': profils.profilsOrder
                    };
                    Helper.sendResponseToClient(response, 0, res);
                })
                .catch((err) => {
                    console.error(err);
                    Helper.sendResponseToClient("Something went wrong!", 1, res);
                })
        });
    }
}
module.exports = BrowseController;