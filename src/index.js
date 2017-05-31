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
        for (let user = 1; user < 6; user++) {
            let sql = "SELECT id FROM users_photos_profils WHERE id_user = ?";

            connection.query(sql, [user],(err, res) => {
                let nb = Math.floor(Math.random() * 5);

                if (res) {
                    UserModel.updateFavoritePhotoById(res[nb], user);
                }
                if (err) {
                    console.error(err);
                }
            })
        }
        return true;
    })
    .then(() => {
        const server = new Server();
        server.listen();
    })
    .catch((err) => {
        console.error(err);
    })
;
