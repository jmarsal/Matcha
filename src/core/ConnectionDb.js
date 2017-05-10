/**
 * Created by jmarsal on 5/9/17.
 */

const mysql = require('mysql');

var setPort = 3307;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: nameDb,
    port: setPort
});
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        global.connection = require('./core/ConnectionDb');
    }
});
module.exports = connection;
