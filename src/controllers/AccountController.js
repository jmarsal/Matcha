/**
 * Created by jbmar on 30/04/2017.
 */

const express = require('express');
const Helper = require('../core/Helpers');
const fs = require('fs');
const uniqid = require('uniqid');

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
                res.render('./views/account/accountContent', {
                    title: 'Mon compte !!!',
                    sessionLogin: req.session.user.login
                });
            } else {
                res.redirect('../accueil');
            }
        });
    }

    accountPostRoute() {
        this.router.post('/account/post', (req, res) => {
            if (req.session.start) {

                let namePhoto = req.body.namePhoto.replace('.jpg', '').replace('.jpeg', '').replace('.png', '').replace('.gif', ''),
                    type = req.body.typePhoto.replace('image/', '')
                ;
                //var data = req.body.src.replace(/^data:image\/\w+;base64,/, '');
                //const buffer = new Buffer(req.body.src,'base64');
                //console.log(buffer);
                //pngToJpeg({quality: 90})(buffer).then(output => fs.writeFileSync("test.jpeg", output), function () {
                //
                //});
                //const base64Data = req.body.src.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/gif;base64,/, "");
                //
                //fs.writeFile(namePhoto + "." + type, base64Data, 'base64', function(err) {
                //    console.log(err);
                //});
                //console.log(data);
                //fs.writeFile(namePhoto + "." + type, new Buffer(data, "base64"), function(err){
                //    console.log(err);
                //});
                //fs.writeFile("arghhhh.jpg", new Buffer(request.body.photo, "base64").toString(), function(err) {});
            } else {
                res.redirect('../accueil');
            }
        });
    }
}
module.exports = AccountController;
