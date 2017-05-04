/**
 * Created by jbmar on 01/05/2017.
 */

import express from 'express';

// Core
import FrontController from './controllers/404_Controller';
import AppController from './controllers/AccountController';
import AuthController from './controllers/AccueilController';
import AuthController from './controllers/AppController';
import AuthController from './controllers/ProfilUserController';
import AuthController from './controllers/RechercheController';

class Router {
    constructor() {
        constructor() {
            if (!app) {
                console.error('Error! Exiting... You must provide the Express instance to the Router.');
                process.exit(1);
            }

            this.registerRoutes();
        }
    }

    registerRoutes() {

    }
}


