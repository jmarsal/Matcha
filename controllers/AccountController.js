/**
 * Created by jbmar on 30/04/2017.
 */
exports.account = function (response) {
    var pug = require('pug'),
        account = pug.renderFile('./views/accueil/appContent.pug', {
            title: 'Mon compte !!!'})
    ;

    response.status(200).send(account)
};
