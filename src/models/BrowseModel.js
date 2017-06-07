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

    static updateDistanceFromUserAndtheOther(idUserSession, profils, infosUserSession) {
        return Promise.all(profils.map((profil) => {
            return BrowseModel.getDistanceFromAddress(idUserSession, infosUserSession, profil)
        }));
    }

    static getDistanceFromAddress(idUserSession, infosUserSession, profil) {
        return new Promise((resolve, reject) => {
            let distance = geolib.getDistanceSimple(
                {latitude: infosUserSession[0].lat, longitude: infosUserSession[0].lng},
                {latitude: profil.lat, longitude: profil.lng}
            );

            BrowseModel.sendDistanceFromUserSessionInDb(idUserSession, distance, profil.id)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                })
            ;
        });
    }

    static sendDistanceFromUserSessionInDb(idUserSession, distanceFromUser, idProfil) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT id FROM user_interacts WHERE id_user_session = ? && id_user = ?"

            connection.query(sql, [idUserSession, idProfil], (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (res.length) {
                        sql = "UPDATE user_interacts SET distanceFromUser = ? WHERE id_user_session = ? && id_user = ?";

                        connection.query(sql, [distanceFromUser, idUserSession, idProfil], (err) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        });
                    } else {
                        sql = "INSERT INTO user_interacts SET id_user_session = ?, distanceFromUser = ?, id_user = ?"

                        connection.query(sql, [idUserSession, distanceFromUser, idProfil], (err) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        });
                    }
                }
            })
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
                                    for (let i = 0; i < tagsCommun.length; i++) {
                                        BrowseModel.addCommunTagsToDb(tagsCommun[i].tagsCommun, tagsCommun[i].id, idUserSession);
                                    }
                                    resolve();
                                });
                        }
                    })
                }
            });
        });
    }

    static addCommunTagsToDb(tag, idUser, idUserSession) {
        return new Promise((resolve, reject) => {
            let sql = "UPDATE user_interacts SET tagsCommun = ? WHERE id_user = ? && id_user_session = ?"

            connection.query(sql, [tag, idUser, idUserSession], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static calculateCommunTagsByUsers(Alltags) {
        return new Promise((resolve, reject) => {
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

    static filterProfilsOrderByDistance(idUserSession, infosUserSession, infosUsersDistances) {
        return new Promise((resolve, reject) => {
            let sql = "",
                orientation = infosUserSession[0].orientation,
                sex = infosUserSession[0].sex
            ;

            if (orientation == 3 && sex == 1) { // Homme be => trouver homme gay ou be + femme hetero ou be
                sql = "SELECT * " +
                    "FROM users " +
                    "INNER JOIN user_interacts " +
                    "ON users.id = user_interacts.id_user " +
                    "WHERE users.id != ? && " +
                    "(sex = 1 && (orientation = 1 || orientation = 3) || sex = 2 && (orientation = 1 || orientation = 3)) " +
                    "ORDER BY distanceFromUser ASC";
            } else if (orientation == 3 && sex == 2) { // Femme be => trouver homme hetero ou be + femme gay ou be
                sql = "SELECT * " +
                    "FROM users " +
                    "INNER JOIN user_interacts " +
                    "ON users.id = user_interacts.id_user " +
                    "WHERE users.id != ? && " +
                    "(sex = 1 && (orientation = 2 || orientation = 3) || sex = 2 && (orientation = 2 || orientation = 3)) " +
                    "ORDER BY distanceFromUser ASC";
            } else if (orientation == 2 && sex == 1) { // Homme hetero => trouver femme hetero ou femme be
                sql = "SELECT * " +
                    "FROM users " +
                    "INNER JOIN user_interacts " +
                    "ON users.id = user_interacts.id_user " +
                    "WHERE users.id != ? && sex = 2 && " +
                    "(orientation = 1 || orientation = 3) ";// +
                "ORDER BY distanceFromUser ASC";
            } else if (orientation == 2 && sex == 2) { // femme gay => trouver femme gay ou be
                sql = "SELECT * " +
                    "FROM users " +
                    "INNER JOIN user_interacts " +
                    "ON users.id = user_interacts.id_user " +
                    "WHERE users.id != ? && sex = 2 && " +
                    "(orientation = 2 || orientation = 3) " +
                    "ORDER BY distanceFromUser ASC";
            } else if (orientation == 1 && sex == 1) { // homme gay => trouver homme gay ou be
                sql = "SELECT * " +
                    "FROM users " +
                    "INNER JOIN user_interacts " +
                    "ON users.id = user_interacts.id_user " +
                    "WHERE users.id != ? && sex = 1 && " +
                    "(orientation = 1 || orientation = 3) " +
                    "ORDER BY distanceFromUser ASC";
            } else if (orientation == 1 && sex == 2) { // femme hetero => trouver homme hetero ou be
                sql = "SELECT * " +
                    "FROM users " +
                    "INNER JOIN user_interacts " +
                    "ON users.id = user_interacts.id_user " +
                    "WHERE users.id != ? && sex = 1 && " +
                    "(orientation = 2 || orientation = 3) " +
                    "ORDER BY distanceFromUser ASC";
            }

            connection.query(sql, [idUserSession, idUserSession], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    BrowseModel.engineFilterUsers(res, "distance")
                        .then((newTabUsers) => {
                            resolve(newTabUsers);
                        });
                }
            });
        });
    }

    static engineFilterUsers(data, filterType, zoneSize) { // filterType can be "distance", "tags", "popularity"
        return new Promise((resolve, reject) => {
            let newTabUsers = [],
                CommunTagsFilter = []
            ;

            if (!zoneSize) {
                let zoneSize = 50000;
            }

            if (filterType === "distance") {
                let DistanceFilterTabUser = [];
                // Filtre la data par distance
                for (let i = 0; i < data.length; i++) {
                    if (i > 0) {
                        if (data[i - 1].distanceFromUser > data[i].distanceFromUser &&
                            data[i].distanceFromUser < zoneSize) {
                            DistanceFilterTabUser[i - 1] = data[i];
                            i = 0;
                        }
                    }
                    if (data[i].distanceFromUser < zoneSize) {
                        DistanceFilterTabUser[i] = data[i];
                    }
                }
                //Filtre la data par tags Commun
                for (let i = 0; i < DistanceFilterTabUser.length; i++) {

                    if (i > 0) {
                        if ((DistanceFilterTabUser[i - 1].tagsCommun < DistanceFilterTabUser[i].tagsCommun) &&
                            DistanceFilterTabUser[i].tagsCommun >= 3 &&
                            DistanceFilterTabUser[i].distanceFromUser < zoneSize) {
                            CommunTagsFilter[i - 1] = DistanceFilterTabUser[i];
                            i = 0;
                        }
                    }
                    CommunTagsFilter[i] = DistanceFilterTabUser[i];
                }
                newTabUsers = CommunTagsFilter;
                //Voir pour l'algo de popularite
                // if ((DistanceFilterTabUser[i - 1].popularity < i DistanceFilterTabUser[i].popularity) && DistanceFilterTabUser[i - 1].tagsCommun < 3)
                newTabUsers.map((user) => {
                    console.log(user.distanceFromUser);
                });
                resolve(newTabUsers);
            }
        });
    }
}
module.exports = BrowseModel;