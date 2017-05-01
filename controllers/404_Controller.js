/**
 * Created by jbmar on 30/04/2017.
 */

exports.p_404 = function (response) {
    var pug = require('pug');

    const compiledFunction = pug.renderFile('./views/404/404.pug');
    response.status(404).send(compiledFunction)
};
