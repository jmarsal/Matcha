/**
 * Created by jbmar on 29/04/2017.
 */

const express = require('express');
const path = require('path');
const http = require('http');
const Router = require('./Router');
const bodyParser = require('body-parser');
const session = require('express-session');

class Server {
    constructor() {
        global.app = express();
        global.nameDb = nameDb;

        app.set('httpServer', http.Server(app));
        this.port = 3000;
        // app.set('views', path.join(__dirname, './src'));
        this.middleware();
        app.disable('x-powered-by');
        this.setupViewEngine();

        app.set('router', new Router());
    }

    middleware(){
        app.use(express.static(path.join(__dirname, '../../public')));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
        app.use(session({secret: 'vjbJfljLvdsfv515151', resave: false, saveUninitialized: true, cookie: {maxAge: 3600000}}))
        app.use(require('./middleware/req-session'));
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