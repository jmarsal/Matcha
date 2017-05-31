/**
 * Created by jmarsal on 5/3/17.
 */

const Database = require('./core/Database'),
    Server = require('./core/Server'),
    SeedAccount = require('./models/SeedAccount'),
    UserModel = require('./models/UserModel')
;

global.nameDb = 'matchaDb';
global.setPort = 3307;

const seed = new SeedAccount();
const db = new Database();
db.createDb()
    .then(() => {
        return db.connectDb()
    })
    .then(() => {
        return db.createTables()
    })
    .then(() => {
        return seed.insertData();
    })
    .then(() => {
        return seed.addPhotosToFolderUsers();
    })
    .then(() => {
        const server = new Server();
        server.listen();
    })
    .catch((err) => {
        console.error(err);
    })
;
