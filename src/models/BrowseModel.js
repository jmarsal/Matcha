/**
 * Created by jbmar on 31/05/2017.
 */

class BrowseModel {
    static getAllProfilsWihtoutMe(idUserSession) {
        return new Promise((resolve, reject) => {
        //    Modifier la db pour avoir un champ ville et un pays
        //    Modifier a l'enregistrement de la geolocalisation ou
        //    enregistrement manuel

        //    recuperer infos profils :
        //    id: id_user
        //    login: login_user
        //    bio: login:bio
        //    orientation: if (1 = "un homme", 2 = "une femme", 3 = "un homme ou une femme")
        //    localite: ville / code Postal ou les deux + Pays
        //    photo: photo de profil

            let infos = [];

            this.getInfosAllProfils(idUserSession);
        });
    }

    getInfosAllProfils(idUserSession){
        let sql = "SELECT id, login, orientation, bio, ville, pays FROM users WHERE id != ?";
    }
}
module.exports = BrowseModel;