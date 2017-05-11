/**
 * Created by jbmar on 07/05/2017.
 */

const mysql = require('mysql')
    // connection = require('../core/ConnectionDb')
;

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
                console.log(err);
                console.log('La connection avec le serveur MySQL est impossible dans la class Database');
                process.exit(1);
            }
                this.createDb();
                this.createTables();
        });
    }

    createDb() {

        this.connection.query('CREATE DATABASE IF NOT EXISTS ' + this.nameDb +
            ' DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci', (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    createTables() {
        const users = 'CREATE TABLE IF NOT EXISTS ' + this.nameDb + '.users' +
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
        this.connection.query(users, (err) => {
            if (err) {
                console.log(err);
            }
            global.connection = require('./ConnectionDb');
        });
    }

}

module.exports = Database;