/**
 * Created by jbmar on 30/04/2017.
 */

exports.appParcourir = function (response) {
    var pug = require('pug'),
        app = pug.renderFile('./views/app/appContent.pug', {
            title: 'App / Parcourir !!!'})
    ;

    response.status(200).send(app)
};
