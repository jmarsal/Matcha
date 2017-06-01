/**
 * Created by jbmar on 11/05/2017.
 */

const crypto = require('crypto');
const request = require('request');
const fs = require('fs-extra')

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

    static parseURLParams(url) {
        return new Promise((resolve, reject) => {
            var queryStart = url.indexOf("?") + 1,
                queryEnd = url.indexOf("#") + 1 || url.length + 1,
                query = url.slice(queryStart, queryEnd - 1),
                pairs = query.replace(/\+/g, " ").split("&"),
                parms = {}, i, n, v, nv;

            if (query === url || query === "") reject();

            for (i = 0; i < pairs.length; i++) {
                nv = pairs[i].split("=", 2);
                n = decodeURIComponent(nv[0]);
                v = decodeURIComponent(nv[1]);

                if (!parms.hasOwnProperty(n)) parms[n] = [];
                parms[n].push(nv.length === 2 ? v : null);
            }
            resolve(parms);
        });
    }

    static getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    static isValidDate(data) {
        let years = parseInt(data.yf),
            month = parseInt(data.mf),
            day = parseInt(data.df)
        ;

        if (data.yf.length == 4 && years > 1900 && years < 2017 &&
            data.mf.length == 2 && month > 0 && month <= 12 &&
            data.df.length == 2 && day > 0 && day <= 31) {
            return true;
        }
        return false;
    }

    static saveImgFromWebToServer(src, dest) {
        return new Promise((resolve) => {
            const download = function (uri, filename, callback) {
                request.head(uri, function (err, res, body) {
                    console.log('content-type:', res.headers['content-type']);
                    console.log('content-length:', res.headers['content-length']);

                    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                });
            };
            console.log(src);
            if (src !== "" && dest) {
                download(src, dest, () => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}
module.exports = Helpers;