/**
 * Created by jbmar on 30/04/2017.
 */
exports.recherche = function (response) {
    var pug = require('pug'),
        recherche = pug.renderFile('./views/accueil/appContent.pug', {
            title: 'Recherche !!!'})
    ;

    response.status(200).send(recherche)
};