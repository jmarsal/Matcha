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
}
module.exports = UserModel;


