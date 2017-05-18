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

            connection.query(sql,  [key], (err, res) => {
               if (err) {
                   reject(err);
               }
               if (!res.length || res[0].login !== login) {
                   resolve(false);
               } else {
                   const cle = uniqid();
                   sql = "UPDATE users SET cle = ?, active = ? WHERE login = ?";

                   connection.query(sql,  [cle, 1, login], (err,  res) => {
                      if (err) {
                          reject (err);
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

            connection.query(sql,  [dataUser.login,  dataUser.passwd], (err, res) => {
                if (err) {
                    reject(err);
                }
                if (res.length) {
                    if (res[0].active){
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

            connection.query(sql,  [login], (err, res) => {
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

            connection.query(sql,  [email], (err, res) => {
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

            connection.query(sql,  [email], (err, res) => {
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

            connection.query(sql,  [dataUser.passwd, dataUser.login], (err) => {
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
            let sql = "SELECT id, src_photo, photo_profil FROM users_photos_profils WHERE id_user = ? ORDER BY id ASC";

            connection.query(sql,  [id_user], (err, res) => {
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
}
module.exports = UserModel;


