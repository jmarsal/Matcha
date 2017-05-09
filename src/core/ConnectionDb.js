/**
 * Created by jmarsal on 5/9/17.
 */

const mysql = require('mysql');

var setPort = (process.platform === 'darwin') ? 3307 : 3305;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: nameDb,
    port: setPort
});
connection.connect((err) => {
    if (err) {
        console.log("la base n'existe pas, creation de la base");
    }
});
module.exports = connection;
