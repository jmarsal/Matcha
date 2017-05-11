/**
 * Created by jbmar on 11/05/2017.
 */

class UserModel {
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
}
module.exports = UserModel;


