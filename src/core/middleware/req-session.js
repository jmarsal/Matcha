/**
 * Created by jmarsal on 5/17/17.
 */

module.exports = function (req, res, next) {
    global.session = req.session;
    next();
}
