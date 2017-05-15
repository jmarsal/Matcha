/**
 * Created by jbmar on 07/05/2017.
 */

const mysql = require('mysql');

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
            'active BOOLEAN DEFAULT 0' +
            ')';
        connection.query(users, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    connectDb() {
        return new Promise((resolve,  reject) => {
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