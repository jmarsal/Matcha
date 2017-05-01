/**
 * Created by jbmar on 30/04/2017.
 */
exports.accueil = function (response) {
    var pug = require('pug'),
        accueil = pug.renderFile('./views/accueil/accueilContent.pug', {
            title: 'Accueil !!!'})
    ;
    response.status(200).send(accueil)
};