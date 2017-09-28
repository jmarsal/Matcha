/**
 * Created by jmarsal on 5/3/17.
 */

global.nameDb = 'matchaDb';
global.setPort = 3306;

const Database = require('./core/Database'),
	Server = require('./core/Server'),
	SeedAccount = require('./models/SeedAccount'),
	UserModel = require('./models/UserModel'),
	seed = new SeedAccount(),
	db = new Database(),
	server = new Server();

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
		server.listen();
	})
	.catch((err) => {
		console.error(err);
	});
