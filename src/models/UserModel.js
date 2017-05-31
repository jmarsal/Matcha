/**
 * Created by jbmar on 11/05/2017.
 */

const uniqid = require('uniqid');

class UserModel {
    /*
     ** Enregistre nouvel Utilisateur si non existant dans la DB
     */
    static newUser(dataUser) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT email FROM users WHERE email = ?";

            connection.query(sql, [dataUser.email], (err, res) => {
                if (err) {
                    reject(err);
                }

                if (!res.length) {
                    sql = "INSERT INTO users SET ?";

                    connection.query(sql, dataUser, (err) => {
                        if (err) {
                            reject(err);
                        }

                        resolve(true);
                    });
                } else {
                    resolve(false);
                }
            });
        });
    }

    /*
     **  Change la cle utilisateur dans la DB
     */
    static changeKey(login, key) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT login, cle FROM users WHERE cle = ?";

            connection.query(sql, [key], (err, res) => {
                if (err) {
                    reject(err);
                }
                if (!res.length || res[0].login !== login) {
                    resolve(false);
                } else {
                    const cle = uniqid();
                    sql = "UPDATE users SET cle = ?, active = ? WHERE login = ?";

                    connection.query(sql, [cle, 1, login], (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(true);
                        }
                    });
                }
            });
        });
    }

    /*
     ** Verifie que le couple login / passwd match avec la DB
     */
    static checkUserForLogin(dataUser) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT login, passwd, active FROM users WHERE login = ? && passwd = ?";

            connection.query(sql, [dataUser.login, dataUser.passwd], (err, res) => {
                if (err) {
                    reject(err);
                }
                if (res.length) {
                    if (res[0].active) {
                        resolve(true);
                    } else {
                        resolve("Le compte n'est pas actif!");
                    }
                } else {
                    resolve(false);
                }
            });
        });
    }

    /*
     ** Recupere l'id par le login
     */
    static getIdbyLogin(login) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT id FROM users WHERE login = ?";

            connection.query(sql, [login], (err, res) => {
                if (err) {
                    reject(err);
                }
                if (res.length) {
                    resolve(res[0].id);
                } else {
                    resolve(false);
                }
            });
        });
    }

    /*
     ** Verifie que le couple login / passwd match avec la DB
     */
    static checkEmailForForgetPasswd(email) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT email FROM users WHERE email = ?";

            connection.query(sql, [email], (err, res) => {
                if (err) {
                    reject(err);
                }
                if (res.length) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    /*
     ** Recupere le login associe a l'adresse email dans la DB
     */
    static getLoginCleByEmail(email) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT login, cle FROM users WHERE email = ?";

            connection.query(sql, [email], (err, res) => {
                if (err) {
                    reject(err);
                }
                if (res.length) {
                    const dataUser = {
                        "login": res[0].login,
                        "cle": res[0].cle
                    };
                    resolve(dataUser);
                } else {
                    resolve(false);
                }
            });
        });
    }

    /*
     ** Change le mot de passe User
     */
    static changePasswd(dataUser) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE users SET passwd = ? WHERE login = ?";

            connection.query(sql, [dataUser.passwd, dataUser.login], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    /*
     ** Ajoute id_user, src de la photo, photo_profil dans la db
     */
    static addPhotoProfil(data) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO users_photos_profils SET ?";

            connection.query(sql, data, (err) => {
                if (err) {
                    reject(err);
                }

                resolve(true);
            });
        })
    }

    /*
     ** Recupere drc_photos, photo_profil dans la db
     */

    static getPhotoProfil(id_user) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT id, src_photo, photo_profil FROM users_photos_profils WHERE id_user = ? ORDER BY id DESC";

            connection.query(sql, [id_user], (err, res) => {
                if (err) {
                    reject(err);
                }
                if (res.length) {
                    const photosProfil = res;
                    sql = "SELECT src_photo FROM users_photos_profils WHERE id_user = ? && photo_profil = 1";
                    connection.query(sql, [id_user], (err, res) => {
                        if (err) {
                            reject(err);
                        }
                        if (res.length) {
                            const data = {
                                photosProfil: res[0].src_photo,
                                photos: photosProfil
                            }
                            resolve(data);
                        } else {
                            const data = {
                                photos: photosProfil
                            }
                            resolve(data);
                        }
                    });
                } else {
                    resolve(false);
                }
            });
        });
    }

    static getIdPhotoProfil(src_photo) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT id FROM users_photos_profils WHERE src_photo = ?";

            connection.query(sql, [src_photo], (err, res) => {
                if (err) {
                    reject(err);
                }
                if (res.length) {
                    resolve(res);
                } else {
                    resolve(false);
                }
            });
        });
    }

    static removePhotoById(idPhoto) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT src_photo FROM users_photos_profils WHERE id = ?",
                srcToRemove = ""
            ;

            connection.query(sql, [idPhoto], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    srcToRemove = res[0];
                    sql = "DELETE FROM users_photos_profils WHERE id = ?";
                    connection.query(sql, [idPhoto], (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(srcToRemove);
                        }
                    });
                }
            });
        });
    }

    static updateFavoritePhotoById(idPhoto, id_user) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT photo_profil, src_photo FROM users_photos_profils WHERE id = ?"
            ;

            console.log(idPhoto);
            connection.query(sql, [idPhoto], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(res[0]);
                    let fav = {
                        favorite: (res[0].photo_profil === 0) ? 1 : 0,
                        src: res[0].src_photo
                    }

                    if (fav.favorite === 1) {
                        sql = "UPDATE `users_photos_profils` SET `photo_profil` = 0 WHERE id_user = ? && `photo_profil` = 1"
                        connection.query(sql, [id_user], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                sql = "UPDATE `users_photos_profils` SET `photo_profil` = ? WHERE id = ?";
                                connection.query(sql, [fav.favorite, idPhoto], (err) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(fav);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        });
    }

    static getInfoProfil(userId) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM users WHERE id = ?";

            connection.query(sql, [userId], (err, res) => {
                if (err) {
                    reject(err);
                }
                if (res.length) {
                    let infos = res[0];
                    resolve(infos);
                } else {
                    resolve(false);
                }
            });
        });
    }

    static modifyEmailByUserId(userId, email) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE users SET email = ? WHERE id = ?";

            connection.query(sql, [email, userId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static modifyLoginByUserId(userId, login) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE users SET login = ? WHERE id = ?";

            connection.query(sql, [login, userId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static modifyFirstNameByUserId(userId, FirstName) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE users SET nom = ? WHERE id = ?";

            connection.query(sql, [FirstName, userId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static modifyLastNameByUserId(userId, lastName) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE users SET prenom = ? WHERE id = ?";

            connection.query(sql, [lastName, userId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static modifySexByUserId(userId, sex) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE users SET sex = ? WHERE id = ?";

            connection.query(sql, [sex, userId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static getSexByUserId(userId, sex) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT sex FROM users WHERE id = ?";

            connection.query(sql, [userId], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res[0].sex);
                }
            });
        });
    }

    static modifyOrientationByUserId(userId, orientation) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE users SET orientation = ? WHERE id = ?";

            connection.query(sql, [orientation, userId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static modifyBioByUserId(userId, bio) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE users SET bio = ? WHERE id = ?";

            connection.query(sql, [bio, userId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static getTagsInDb(idUser) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tags ORDER BY tag ASC",
                result = {
                    tags: "",
                    tags_user: "",
                    check: [{
                        idTag: "",
                        check: false
                    }]
                };

            connection.query(sql, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    sql = "SELECT * FROM tags_user WHERE id_user = ? ORDER BY tag ASC";
                    result.tags = res;
                    for (let i = 0; i < res.length; i++){
                        result.check[i] = new Object();
                    }
                    connection.query(sql, [idUser],(err, res) => {
                        if (err) {
                            reject(err);
                        }
                        result.tags_user = res;
                        resolve(result);
                    });
                }
            });
        });
    }

    static addNewTag(idUser, tag) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT tag FROM tags WHERE tag = ?";

            connection.query(sql, [tag], (err, res) => {
                if (err) {
                    reject(err);
                }
                if (!res.length) {
                    sql = "INSERT INTO tags SET ?";

                    connection.query(sql, [{"tag": tag}], (err) => {
                        if (err) {
                            reject(err);
                        }
                        sql = "INSERT INTO tags_user SET ?";

                        connection.query(sql, [{"tag": tag, "id_user": idUser}], (err) => {
                            if (err) {
                                reject(err);
                            }

                            sql = "SELECT id FROM tags WHERE tag = ?";

                            connection.query(sql, [tag], (err, res) => {
                                if (err) {
                                    reject(err);
                                }
                                resolve(res[0]);
                            });
                        });
                    });
                } else {
                    resolve(false);
                }
            });
        });
    }

    static modifyTagUserByTag(userId, tag) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT tag FROM tags_user WHERE tag = ?";

            connection.query(sql, [tag], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    if (res.length){
                        sql = "DELETE FROM tags_user WHERE tag = ?";

                        connection.query(sql, [tag], (err, res) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(true);
                            }
                        });
                    } else {
                        sql = "INSERT INTO tags_user SET ?";

                        connection.query(sql, [{"tag": tag, "id_user": userId}], (err, res) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(false);
                            }
                        });
                    }
                }
            });
        });
    }

    static addLocationProfil(resData, id_user) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE users SET ? WHERE id = ?";

            connection.query(sql, [resData, id_user], (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        })
    }
}
module.exports = UserModel;


