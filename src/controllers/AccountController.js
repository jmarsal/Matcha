/**
 * Created by jbmar on 30/04/2017.
 */

const express = require('express');
const Helper = require('../core/Helpers');
const fs = require('fs');
const uniqid = require('uniqid');
const makeDir = require('make-dir');
const thumb = require('node-thumbnail').thumb;
const easyimg = require('easyimage');
const multer = require('multer');
const path = require('path');
const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/profils/" + req.session.user.id);
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});
const upload = multer({ storage: Storage }).single("photos-profil"); //Field name and max count

class AccountController {
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
        this.accountRoute();
        this.accountPostRoute();
    }

    accountRoute() {
        this.router.get('/account', (req, res) => {
            if (req.session.start) {
                makeDir('./public/profils/' + req.session.user.id);
                res.render('./views/account/accountContent', {
                    title: 'Mon compte !!!'
                });
            } else {
                res.redirect('../accueil');
            }
        });
    }

    accountPostRoute() {
        this.router.post("/account/Upload", function (req, res) {
            upload(req, res, (err) => {
                if (err) {
                    console.error(err);
                    Helper.sendResponseToClient("Something went wrong!", 1, res);
                } else {
                    let validImage = ["image/gif", "image/jpeg", "image/png"];

                    if (validImage.indexOf(req.file.mimetype) >= 0) {
                        if (req.file.size <= 1500000) {
                            //console.log(req.file);
                            const data = {
                                'mess': "La photo est enregistrée!",
                                'srcPhoto': req.file.destination + '/' +req.file.filename.replace('.jpg', '_thumb.jpg')
                            };
                            easyimg.rescrop({
                                src:req.file.path, dst:"./public/profils/" + req.session.user.id + req.file.filename.replace('.jpg', '_thumb.jpg'),
                                width:100, height:100,
                                x:0, y:0
                            }).then(
                                function(image) {
                                    console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
                                    Helper.sendResponseToClient(data , 0, res);
                                },
                                function (err) {
                                    console.log(err);
                                }
                            );
                            //thumb({
                            //    source: req.file.path,
                            //    destination: "./public/profils/" + req.session.user.id,
                            //    concurrency: 4,
                            //    width: 100,
                            //    height: 100
                            //}).then(function() {
                            //    Helper.sendResponseToClient(data , 0, res);
                            //}).catch(function(e) {
                            //    console.log('Error', e.toString());
                            //});
                        } else {
                            Helper.sendResponseToClient("L'image est trop volumineuse ! (max: 1,5Mo)", 1, res);
                        }
                    } else {
                        Helper.sendResponseToClient("Le fichier n'est un jpg, png, ou gif !", 1, res);
                    }
                }
            });
        });
    }
}
module.exports = AccountController;
