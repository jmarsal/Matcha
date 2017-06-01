/**
 * Created by jbmar on 31/05/2017.
 */

const distance = require('google-distance')
    // BrowseModelBack = require('./BrowseModel')
;

class BrowseModel {

    static getInfosAllProfils(idUserSession) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT id, login, orientation, bio, address, lat, lng, age, city, country FROM users WHERE id != ?";

            connection.query(sql, [idUserSession], (err, res) => {
                resolve(res);
                if (err) {
                    reject(err);
                }
            });
        });
    }

    static getAllPhotosProfils(idUserSession) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT id_user, src_photo FROM users_photos_profils WHERE id_user != ? && photo_profil = 1";

            connection.query(sql, [idUserSession], (err, res) => {
                resolve(res);
                if (err) {
                    reject(err);
                }
            });
        });
    }

    static getaddressUserSession(idUserSession) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT address FROM users WHERE id = ?";

            connection.query(sql, [idUserSession], (err, res) => {
                resolve(res);
                if (err) {
                    reject(err);
                }
            });
        });
    }

    static updateDistanceFromUserAndtheOther(idUserSession, profils, addressUserSession) {
        return Promise.all(profils.map((profil) => {
            console.log(addressUserSession[0].address);
            console.log(profil.address);
            return BrowseModel.getDistanceFromAddress(addressUserSession[0].address, profil.address, idUserSession)
        }));
    }

    static getDistanceFromAddress(address1, address2, idUser) {
        return new Promise((resolve, reject) => {
            // Essayer avec latLng peut etre ...
            distance.get({
                origin: address1,
                destination: address2
            }, (err, data) => {
                if (err) {
                    console.log('ici')
                    reject(err);
                }
                else {
                    console.log(data.distance);
                    BrowseModel.sendDistanceFromUserSessionInDb(data.distance, idUser)
                        .then(() => {
                            resolve();
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            });
        });
    }

    static sendDistanceFromUserSessionInDb(distanceFromUser, id_user) {
        return new Promise((resolve, reject) => {
            let sql = "UPDATE users SET distanceFromUser = ? WHERE id = ?";

            console.log(distanceFromUser)
            console.log(id_user)
            connection.query(sql, [distanceFromUser, id_user], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}
module.exports = BrowseModel;