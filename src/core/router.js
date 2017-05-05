/**
 * Created by jbmar on 01/05/2017.
 */

const express = require('express');

// Core
const AccueilController = require('../controllers/AccueilController');
// import FrontController from './controllers/404_Controller';
// import AccountController from './controllers/AccountController';
// import AppController from './controllers/AppController';
// import ProfilUserController from './controllers/ProfilUserController';
// import RechercheController from './controllers/RechercheController';

class Router {
    constructor() {
        if (!app) {
            console.error('Error! Exiting... You must provide the Express instance to the Router.');
            process.exit(1);
        }

        this.registerRoutes();
    }

    registerRoutes() {
        // APP
        new AccueilController();
    }
}

module.exports = Router;


