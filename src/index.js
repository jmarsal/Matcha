/**
 * Created by jmarsal on 5/3/17.
 */

const Database = require('./core/Database'),
      Server = require('./core/Server')
;

global.nameDb = 'matchaDb';
global.setPort = 3307;

new Database();
const server = new Server();
server.listen();
