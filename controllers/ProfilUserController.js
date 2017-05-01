/**
 * Created by jbmar on 30/04/2017.
 */
exports.profilUser = function (response) {
    var pug = require('pug'),
        profil = pug.renderFile('./views/accueil/appContent.pug', {
            title: 'Profil User !!!'})
    ;

    response.status(200).send(profil)
};
