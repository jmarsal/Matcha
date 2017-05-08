/**
 * Created by jbmar on 29/04/2017.
 */

const express = require('express');
const path = require('path');
const http = require('http');
const Router = require('./Router');

class Server {
    constructor() {
        global.app = express();

        app.set('httpServer', http.Server(app));
        this.port = 8080;
        app.set('views', path.join(__dirname, './src'));
        app.use(express.static(path.join(__dirname, '../../public')));

        app.disable('x-powered-by');
        this.setupViewEngine();

        app.set('router', new Router());
    }

    setupViewEngine() {
        app.set('views', path.join(__dirname, '../../src'));
        app.set('view engine', 'pug');
    }

    listen() {
        app.get('httpServer').listen(this.port, () => {
            console.log(`Listening on port ${ this.port }`);
        });
    }
}

module.exports = Server;