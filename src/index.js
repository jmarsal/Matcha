/**
 * Created by jmarsal on 5/3/17.
 */

const Database = require('./core/Database'),
    Server = require('./core/Server'),
    SeedAccount = require('./models/SeedAccount'),
    Helper = require('./core/Helpers')

;

global.nameDb = 'matchaDb';
global.setPort = 3307;

const db = new Database();
db.createDb()
    .then(() => {
        let makedb = [
            db.connectDb(),
            db.createTables()
        ]
        Promise.all([
            makedb.map(Helper.reflect)
        ]).then(() => {
            new SeedAccount();
            const server = new Server();
            server.listen();
        }).catch((err) => {
            console.error(err);
        });
    }).catch((err) => {
    console.error(err);
});
