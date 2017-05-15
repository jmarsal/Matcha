/**
 * Created by jbmar on 30/04/2017.
 */

const express = require('express');

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
        this.accueilRoute();
    }

    accueilRoute() {
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
}
module.exports = AccountController;
