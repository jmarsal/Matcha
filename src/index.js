/**
 * Created by jmarsal on 5/3/17.
 */

const Database = require('./core/Database'),
      Server = require('./core/Server')
;
global.nameDb = 'matchaDb';

new Database();
global.connection = require('./core/ConnectionDb');
const server = new Server();
server.listen();
