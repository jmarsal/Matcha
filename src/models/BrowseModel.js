/**
 * Created by jbmar on 31/05/2017.
 */

class BrowseModel {

    static getInfosAllProfils(idUserSession) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT id, login, orientation, bio, city, country FROM users WHERE id != ?";

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

} module.exports = BrowseModel;