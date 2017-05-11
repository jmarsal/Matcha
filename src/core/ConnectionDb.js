/**
 * Created by jmarsal on 5/9/17.
 */

const mysql = require('mysql');

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
    }
});
module.exports = connection;
