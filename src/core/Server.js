/**
 * Created by jbmar on 29/04/2017.
 */

const express = require('express'),
	path = require('path'),
	http = require('http'),
	Router = require('./Router'),
	bodyParser = require('body-parser'),
	expressSession = require('express-session'),
	SocketIo = require('../core/Socket'),
	sharedsession = require('express-socket.io-session');

class Server {
	constructor() {
		global.app = express();
		global.nameDb = nameDb;

		app.set('httpServer', http.Server(app));
		this.port = 3000;

		this.middleware();
		app.disable('x-powered-by');
		this.setupViewEngine();

		app.set('router', new Router());
		app.set('wSocket', new SocketIo());
	}

	middleware() {
		const session = expressSession({
			secret: 'vjbJfljLvdsfv515151',
			resave: false,
			saveUninitialized: true,
			cookie: { maxAge: 3600000 }
		});

		app.use(express.static(path.join(__dirname, '../../public')));

		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

		app.set('session', session);
		app.use(session);

		app.use(require('./middleware/req-session'));
	}

	setupViewEngine() {
		app.set('views', path.join(__dirname, '../../src'));
		app.set('view engine', 'pug');
	}

	listen() {
		app.get('httpServer').listen(this.port, () => {
			console.log(`Listening on port ${this.port}`);
		});
	}
}

module.exports = Server;
