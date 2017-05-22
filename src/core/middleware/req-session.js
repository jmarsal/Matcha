/**
 * Created by jmarsal on 5/17/17.
 */

module.exports = function (req, res, next) {
    res.locals.session = req.session;
    next();
}
