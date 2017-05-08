/**
 * Created by jmarsal on 5/3/17.
 */

const Database = require('./core/Database');
const Server = require('./core/Server');

global.connectionDb = new Database();
const server = new Server();
server.listen();
