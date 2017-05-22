/** * Created by jbmar on 30/04/2017. */"use strict";const Helper = require('../core/Helpers');const UserModel = require('../models/UserModel');const express = require('express');const fs = require('fs');const uniqid = require('uniqid');const makeDir = require('make-dir');const multer = require('multer');const path = require('path');const Storage = multer.diskStorage({    destination: function (req, file, callback) {        callback(null, "./public/profils/" + session.user.id);    },    filename: function (req, file, callback) {        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);    }});class AccountController {    constructor() {        if (!app) {            console.error('Error! Exiting... You must provide the Express instance to controllers.');            process.exit(1);        }        this.router = express.Router();        this.registerRoutes();        app.use('/', this.router);    }    registerRoutes() {        this.accountRoute();        this.accountPostRoute();    }    accountRoute() {        this.router.get('/account', (req, res) => {            if (session.start) {                makeDir('./public/profils/' + session.user.id);                UserModel.getPhotoProfil(session.user.id)                    .then((status) => {                        if (status !== false) {                            session.photosUsers = new Object();                            function fillSessionPhotosUsers() {                                return new Promise((resolve) => {                                    let count = 0;                                    for (let i = 0; i < status.length; i++) {                                        session.photosUsers[i] = status[i];                                        count++;                                    }                                    if (count === status.length){                                        resolve();                                    }                                })                            }                            fillSessionPhotosUsers()                                .then(() => {                                    res.render('./views/account/accountContent.pug', {                                        title: 'Mon compte !!!'                                    });                                })                        } else {                            res.render('./views/account/accountContent.pug', {                                title: 'Mon compte !!!'                            });                        }                    }).catch((err) => {                    if (err) {                        console.error(err);                    }                });            } else {                res.redirect('../accueil');            }        });    }    accountPostRoute() {        this.router.post("/account/Upload", (req, res) => {            const upload = multer({                storage: Storage,                limits: {fileSize: 5000000},                fileFilter: (req, file, cb) => {                    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {                        Helper.sendResponseToClient("Le fichier n'est un jpg, png, ou gif !", 1, res);                    } else {                        cb(null, true);                    }                }            }).single("photos-profil"); //Field name and max count            upload(req, res, (err) => {                if (err) {                    if (err.toString().indexOf("Error: File too large") > -1) {                        Helper.sendResponseToClient("L'image est trop volumineuse ! (max: 5Mo)", 1, res);                    } else {                        console.error(err);                        Helper.sendResponseToClient("Something went wrong!", 1, res);                    }                } else {                    if (!req.file) {                        Helper.sendResponseToClient("Il faut choisir une photo avant !", 1, res);                    } else {                        const src_photo = req.file.destination.replace('./public', '') + '/' + req.file.filename;                        const data = {                            'id_user': session.user.id,                            'src_photo': src_photo                        }                        UserModel.addPhotoProfil(data)                            .then(() => {                                UserModel.getIdPhotoProfil(src_photo)                                    .then((id) => {                                        if (id !== false) {                                            const response = {                                                'mess': "La photo est enregistrée!",                                                'srcPhoto': src_photo,                                                'idPhoto': id[0].id                                            };                                            Helper.sendResponseToClient(response, 0, res);                                        }                                    }).catch((err) => {                                    console.error(err);                                })                            }).catch((err) => {                            if (err) {                                console.error(err);                            }                        });                    }                }            });        });        this.router.post("/account/Delete", (req, res) => {            UserModel.removePhotoById(req.body.id)                .then(() => {                    session.photosUsers = null;                    Helper.sendResponseToClient('photo supprimée!', 0, res);                }).catch((err) => {                console.error(err);                Helper.sendResponseToClient('La suppression a rencontrée un problème!', 1, res);            })        });        this.router.post("/account/Favorite", (req, res) => {            UserModel.updateFavoritePhotoById(req.body.id)                .then((fav) => {                    Helper.sendResponseToClient(fav, 0, res);                }).catch((err) => {                console.error(err);                Helper.sendResponseToClient('La suppression a rencontrée un problème!', 1, res);            })        });    }}module.exports = AccountController;