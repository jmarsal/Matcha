/**
 * Created by jmarsal on 5/3/17.
 */

const Database = require('./core/Database'),
	Server = require('./core/Server'),
	io = require('socket.io'),
	SeedAccount = require('./models/SeedAccount'),
	UserModel = require('./models/UserModel');

global.nameDb = 'matchaDb';
global.setPort = 3307;

const seed = new SeedAccount();
const db = new Database();
db
	.createDb()
	.then(() => {
		return db.connectDb();
	})
	.then(() => {
		return db.createTables();
	})
	.then(() => {
		return UserModel.getIdbyLogin('FredericLopez');
	})
	.then((status) => {
		if (status === false) {
			return seed.insertData();
		} else {
			return false;
		}
	})
	.then(() => {
		const server = new Server();

		server.listen();
		// debugger;
		// Chargement de socket.io
		// var sio = io.listen(server.app);

		// Quand un client se connecte, on le note dans la console
		// sio.sockets.on('connection', function(socket) {
		// 	console.log('Un client est connecté !');
		// });
	})
	.catch((err) => {
		console.error(err);
	});
