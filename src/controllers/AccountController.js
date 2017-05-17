/**
 * Created by jbmar on 30/04/2017.
 */

const express = require('express');
const Helper = require('../core/Helpers');
const fs = require('fs');
const uniqid = require('uniqid');
const multer = require('multer');
const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./Images");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});
const upload = multer({ storage: Storage }).array("imgUploader", 3); //Field name and max count

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
        this.router.post("/account/Upload", function (req, res) {
            console.log('server');
            upload(req, res, function (err) {
                console.log('upload');
                if (err) {
                    console.error(err);
                    return res.end("Something went wrong!");
                }
                res.render('views/account/accountContent', {
                    error: "Image Upload !"
                });

                // Helper.sendResponseToClient("File uploaded sucessfully!.", 0, res);
                // return res.end("File uploaded sucessfully!.");
            });
        });

        // this.router.post('/account/post', (req, res) => {

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
            // } else {
            //     res.redirect('../accueil');
            // }
        // });
    }
}
module.exports = AccountController;
