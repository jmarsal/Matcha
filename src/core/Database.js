/**
 * Created by jbmar on 07/05/2017.
 */
const mysql = require('mysql');

var setPort = (process.platform === 'darwin') ? 3307 : 3305;

class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            port: setPort
        });
        this.connection.connect((err) => {
            if (err) {
                console.log(err);
                process.exit(1);
            } else {
                this.createDb();
                this.createTables();
            }
        });
        return (this.connection);
    }

    createDb() {

        this.connection.query('CREATE DATABASE IF NOT EXISTS '+ nameDb +
            ' DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci', (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    createTables() {
        const users = 'CREATE TABLE IF NOT EXISTS '+ nameDb  +'.users' +
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
        });
    }

}

module.exports = Database;