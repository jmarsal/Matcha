/**
 * Created by jbmar on 31/05/2017.
 */

const geolib = require('geolib');

class BrowseModel {

    static getInfosAllProfils(idUserSession) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT id, login, orientation, bio, lat, lng, age, city, country FROM users WHERE id != ?";

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

    static getInfosUserSession(idUserSession) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM users WHERE id = ?";

            connection.query(sql, [idUserSession], (err, res) => {
                resolve(res);
                if (err) {
                    reject(err);
                }
            });
        });
    }

    static updateDistanceFromUserAndtheOther(profils, infosUserSession) {
        return Promise.all(profils.map((profil) => {
            return BrowseModel.getDistanceFromAddress(infosUserSession, profil)
        }));
    }

    static getDistanceFromAddress(infosUserSession, profil) {
        return new Promise((resolve, reject) => {
            let distance = geolib.getDistanceSimple(
                {latitude: infosUserSession[0].lat, longitude: infosUserSession[0].lng},
                {latitude: profil.lat, longitude: profil.lng}
            );

            BrowseModel.sendDistanceFromUserSessionInDb(distance, profil.id)
                .then(() => {
                    resolve(infosUserSession);
                })
                .catch((err) => {
                    reject(err);
                })
            ;
        });
    }

    static sendDistanceFromUserSessionInDb(distanceFromUser, idProfil) {
        return new Promise((resolve, reject) => {
            let sql = "UPDATE users SET distanceFromUser = ? WHERE id = ?";

            connection.query(sql, [distanceFromUser, idProfil], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static getCommunTagsByUsers(idUserSession) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tags_user WHERE id_user != ?",
                AllTags = {
                    tagsAllOtherUsers: [],
                    tagsUserSession: []
                }
            ;

            connection.query(sql, [idUserSession], (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    AllTags.tagsAllOtherUsers = res;
                    sql = "SELECT * FROM tags_user WHERE id_user = ?";

                    connection.query(sql, [idUserSession], (err, res) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            AllTags.tagsUserSession = res;
                            BrowseModel.calculateCommunTagsByUsers(AllTags)
                                .then((tagsCommun) => {
                                    console.log(tagsCommun);
                                    for (let i = 0; i < tagsCommun.length; i++) {
                                        sql = "UPDATE users SET tagsCommun = ? WHERE id = ?"

                                        connection.query(sql, [tagsCommun[i].tagsCommun, tagsCommun[i].id], (err) => {
                                            if (err) {
                                                reject(err);
                                            }
                                        });
                                    }
                                    resolve();
                                });
                        }
                    })
                }
            });
        });
    }

    static calculateCommunTagsByUsers(Alltags) {
        return new Promise((resolve, reject) => {
            // console.log(AllTags);
            let user = 0,
                countByUser = []
            ;

            Alltags.tagsUserSession.map((tagUserSession) => { // Parcours chaques tag user Session
                let count = 0;

                Alltags.tagsAllOtherUsers.map((tagAllOtherUsers) => {
                    if (user !== tagAllOtherUsers.id_user) {
                        user = tagAllOtherUsers.id_user;
                    }
                    if (user === tagAllOtherUsers.id_user) {
                        if (countByUser[user]) {
                            count = countByUser[user];
                        } else {
                            count = 0;
                        }
                        if (tagAllOtherUsers.tag === tagUserSession.tag) {
                            count++;
                        }
                    }
                    countByUser[user] = count;
                });
            });
            let dataToSend = [],
                j = 0
            ;

            for (let i = 0; i < countByUser.length; i++) {
                if (countByUser[i] && countByUser[i] > 0) {
                    dataToSend[j] = {
                        "id": i,
                        "tagsCommun": countByUser[i]
                    }
                    j++;
                }
            }
            resolve(dataToSend);
        });
    }

    static filterProfilsOrderByDistance(idUserSession, infosUserSession) {
        return new Promise((resolve, reject) => {
            let sql = "",
                orientation = infosUserSession[0].orientation,
                sex = infosUserSession[0].sex
            ;
            if (orientation == 3 && sex == 1) { // Homme be => trouver homme gay ou be + femme hetero ou be
                sql = "SELECT * FROM users WHERE id != ? && (sex = 1 && (orientation = 1 || orientation = 3) || sex = 2 && (orientation = 1 || orientation = 3)) ORDER BY distanceFromUser ASC";
            } else if (orientation == 3 && sex == 2) { // Femme be => trouver homme hetero ou be + femme gay ou be
                sql = "SELECT * FROM users WHERE id != ? && (sex = 1 && (orientation = 2 || orientation = 3) || sex = 2 && (orientation = 2 || orientation = 3)) ORDER BY distanceFromUser ASC";
            } else if (orientation == 2 && sex == 1) { // Homme hetero => trouver femme hetero ou femme be
                sql = "SELECT * FROM users WHERE id != ? && sex = 2 && (orientation = 1 || orientation = 3) ORDER BY distanceFromUser ASC";
            } else if (orientation == 2 && sex == 2) { // femme gay => trouver femme gay ou be
                sql = "SELECT * FROM users WHERE id != ? && sex = 2 && (orientation = 2 || orientation = 3) ORDER BY distanceFromUser ASC";
            } else if (orientation == 1 && sex == 1) { // homme gay => trouver homme gay ou be
                sql = "SELECT * FROM users WHERE id != ? && sex = 1 && (orientation = 1 || orientation = 3) ORDER BY distanceFromUser ASC";
            } else if (orientation == 1 && sex == 2) { // femme hetero => trouver homme hetero ou be
                sql = "SELECT * FROM users WHERE id != ? && sex = 1 && (orientation = 2 || orientation = 3) ORDER BY distanceFromUser ASC";
            }

            connection.query(sql, [idUserSession], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }
}
module.exports = BrowseModel;