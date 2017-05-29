/**
 * Created by jbmar on 07/05/2017.
 */

const mysql = require('mysql');
const makeDir = require('make-dir');

const CreateSeedAccount = require('../models/SeedAccount.js');

class Database {
    constructor() {

        this.nameDb = nameDb;
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            port: setPort
        });
        this.connection.connect((err) => {
            if (err) {
                console.error(err);
                console.error('La connection avec le serveur MySQL est impossible dans la class Database');
                process.exit(1);
            }
            this.createDb()
                .then(() => {
                    this.connectDb()
                        .then(() => {
                            this.createTables();
                        }).catch((err) => {
                        console.error(err);
                    });
                }).catch((err) => {
                console.error(err);
            });

        });
    }

    createDb() {
        return new Promise((resolve, reject) => {
            this.connection.query('CREATE DATABASE IF NOT EXISTS ' + this.nameDb +
                ' DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    createTables() {
        const users = 'CREATE TABLE IF NOT EXISTS users' +
            '(' +
            'id INT PRIMARY KEY AUTO_INCREMENT,' +
            'nom VARCHAR(255) DEFAULT NULL,' +
            'prenom VARCHAR(255) DEFAULT NULL,' +
            'login VARCHAR(16) DEFAULT NULL,' +
            'email VARCHAR(255) DEFAULT NULL,' +
            'passwd VARCHAR(255) DEFAULT NULL,' +
            'cle VARCHAR(255) DEFAULT NULL,' +
            'active BOOLEAN DEFAULT 0,' +
            'sex SMALLINT DEFAULT 2,' +
            'orientation SMALLINT DEFAULT 3,' +
            'bio TEXT DEFAULT NULL,' +
            'adress VARCHAR(255) DEFAULT NULL,' +
            'lat FLOAT(10, 6) DEFAULT NULL,' +
            'lng FLOAT(10, 6) DEFAULT NULL' +
            ')';
        const userPhotos = 'CREATE TABLE IF NOT EXISTS users_photos_profils' +
            '(' +
            'id INT PRIMARY KEY AUTO_INCREMENT,' +
            'id_user INT NOT NULL,' +
            'src_photo VARCHAR(255) NOT NULL,' +
            'photo_profil BOOLEAN DEFAULT 0' +
            ')';
        const tagsUser = 'CREATE TABLE IF NOT EXISTS tags_user' +
            '(' +
            'id INT PRIMARY KEY AUTO_INCREMENT,' +
            'id_user INT NOT NULL,' +
            'tag VARCHAR(150) NOT NULL' +
            ')';
        const tags = 'CREATE TABLE IF NOT EXISTS tags' +
            '(' +
            'id INT PRIMARY KEY AUTO_INCREMENT,' +
            'tag VARCHAR(150) NOT NULL' +
            ')';
        connection.query(users, (err) => {
            if (err) {
                console.error(err);
            }
        });
        connection.query(userPhotos, (err) => {
            if (err) {
                console.error(err);
            }
        });
        connection.query(tagsUser, (err) => {
            if (err) {
                console.error(err);
            }
        });
        connection.query(tags, (err) => {
            if (err) {
                console.error(err);
            }
        });
        let SeedAccount = new CreateSeedAccount();
        SeedAccount.addTags()
            .then(() => {
            console.log('resolve addTags');
                SeedAccount.addUsers()
                    .then(() => {
                        console.log('resolve addUsers');
                        SeedAccount.addPhotos()
                            .then(() => {
                                console.log('resolve addPhotos');
                                SeedAccount.addTagsToUser()
                                    .then((res) => {
                                        console.log('resolve addTagsToUser');
                                        console.log(res);
                                    }).catch((err) => {
                                        console.error(err);
                                    });
                            }).catch((err) => {
                                console.error(err);
                            });
                    }).catch((err) => {
                    console.error(err);
                });
            }).catch((err) => {
            console.error(err);
        });
    }

    connectDb() {
        return new Promise((resolve, reject) => {
            global.connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: nameDb,
                port: setPort
            });

            connection.connect((err) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

}

module.exports = Database;