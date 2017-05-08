/**
 * Created by jbmar on 07/05/2017.
 */
const mysql = require('mysql');

class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'matchaDb',
            port: 3305
        });

        this.connection.connect((err) => {
            if (err) {
                this.connection = this.createDb();
            }
            this.createTables(this.connection);
        });
        return (this.connection);
    }

    createDb() {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            port: 3305
        });

        connection.connect((err) => {
            if (err) {
                console.log('Connection impossible avec le serveur MySQL!');
            } else {
                connection.query('CREATE DATABASE IF NOT EXISTS matchaDb ' +
                    'DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci', (err) => {
                    if (err) {
                        console.log('Impossible de créer la base de donnée!');
                    }
                });
                this.createTables(connection);
            }
        });
        return connection;
    }

    createTables(connection) {
        const users = 'CREATE TABLE IF NOT EXISTS matchadb.users' +
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
                console.log('MySQL n\'arrive pas à crée la table users');
            }
        });
    }

}
module.exports = Database;