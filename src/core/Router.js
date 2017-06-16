/**
 * Created by jbmar on 01/05/2017.
 */

const express = require('express');

// Core
const AccueilController = require('../controllers/AccueilController');
const Error404 = require('../controllers/404_Controller');
const AccountController = require('../controllers/AccountController');
const BrowseController = require('../controllers/BrowseController');
const ProfilUserController = require('../controllers/ProfilUserController');
const SearchController = require('../controllers/SearchController');
const NotifsController = require('../controllers/NotifsController');

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
		new AccountController();
		new BrowseController();
		new ProfilUserController();
		new SearchController();
		new NotifsController();
		new Error404();
	}
}

module.exports = Router;
