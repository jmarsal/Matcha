/**
 * Created by jbmar on 11/05/2017.
 */

const crypto = require('crypto');


class Helpers {
    /*
     **  envoie la reponse au client
     */
    static sendResponseToClient(responseMessage, isError, res, redirect, url) {
        res.send(JSON.stringify({
            response: responseMessage,
            isErr: isError,
            isRedirect: redirect,
            isURL: url
        }, null, 3));
    }

    static hashString(string, algo) {
        const hash = crypto.createHash(algo),
            hashPass = hash.update(string, 'utf-8')
        ;
        return hashPass.digest('hex');
    }
}
module.exports = Helpers;