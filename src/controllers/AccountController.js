/**
 * Created by jbmar on 30/04/2017.
 */
// exports.account = function (response) {
//     var pug = require('pug'),
//         account = pug.renderFile('./views/accueil/appContent.pug', {
//             title: 'Mon compte !!!'})
//     ;
//
//     response.status(200).send(account)
// };
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
            res.render('./views/accueil/accueilContent', {
                title: 'Mon compte !!!'
            });
        });
    }
}
module.exports = AccountController;
