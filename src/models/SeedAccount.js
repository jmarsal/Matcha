/**
 * Created by jmarsal on 5/29/17.
 */

const UserModel = require('../models/UserModel');
const Database = require('../core/Database');
const Helper = require('../core/Helpers');
const fs = require('fs-extra')
const makeDir = require('make-dir');
const download = require('download');
const path = require('path');

class SeedAccount {
    constructor() {
        this.nbUsers = "";
        this.basicTags = ["love", "lover", "matchaLove", "football", "jupiter",
            "astronomie", "programation", "computer", "42", "soleil", "vacances",
            "amour", "bateau", "mer", "plage", "montagne", "sableBlanc", "nounours",
            "calins", "musique", "bobMarley", "ganja", "rasta", "enfants", "pleinAir",
            "chat", "chiens", "saxo", "cirque", "velo", "moto", "superman", "hulk",
            "supernova", "pasteque", "häagenDazs"
        ];
        this.basicUsers = [
            {
                "nom": "Jolie",
                "prenom": "Angelina",
                "login": "laraCroft",
                "email": "angelina.jolie@gmail.com",
                "birthday": "1975-06-04",
                "age": 41,
                "passwd": "8d78ad13452b39de768806c1bbc0225cff2608a726003310c329edbacbbb694c7965f3eccfea1508ac0b8debe7cbe8087993bb617ffd0f23acb3140f3df06f6c",
                "cle": "s6nugj39vnqdq",
                "active": 1,
                "sex": 2,
                "orientation": 1,
                "bio": "Cherche acteur plein de fric pour penser à autre chose que Brad...",
                "address": "9200 Sunset Blvd.Suite 550 West Hollywood, CA 90069",
                "lat": 34.0898242,
                "lng": -118.39271339999999,
                "city": "West Hollywood",
                "country": "États-Unis"
            },
            {
                "nom": "Alba",
                "prenom": "Jessica",
                "login": "jAlba",
                "email": "jessica.alba@gmail.com",
                "birthday": "1981-04-28",
                "age": 36,
                "passwd": "8d78ad13452b39de768806c1bbc0225cff2608a726003310c329edbacbbb694c7965f3eccfea1508ac0b8debe7cbe8087993bb617ffd0f23acb3140f3df06f6c",
                "cle": "s6nugj39vnqdq",
                "active": 1,
                "sex": 2,
                "orientation": 2,
                "bio": "Envie de me detendre apres un tournage...",
                "address": "3 Arts Entertainment 9460 Wilshire Blvd. 7th Floor Beverly Hills, CA 90212",
                "lat": 34.066745,
                "lng": -118.3993524,
                "city": "Beverly Hills",
                "country": "États-Unis"
            },
            {
                "nom": "Ciccone",
                "prenom": "Madonna Louise",
                "login": "madonna",
                "email": "madonna@gmail.com",
                "birthday": "1958-08-16",
                "age": 58,
                "passwd": "8d78ad13452b39de768806c1bbc0225cff2608a726003310c329edbacbbb694c7965f3eccfea1508ac0b8debe7cbe8087993bb617ffd0f23acb3140f3df06f6c",
                "cle": "s6nugj39vnqdq",
                "active": 1,
                "sex": 2,
                "orientation": 1,
                "bio": "Si vous votez pour Hillary Clinton, je vous ferai une fellation. Je le jure devant Dieu. Je prends mon temps, je regarde. Oui ? Et au fait, j’avale",
                "address": "Untitled Entertainment 350 S. Beverly Dr. Suite 200 Beverly Hills, CA 90212 USA",
                "lat": 34.0604857,
                "lng": -118.39866840000002,
                "city": "Beverly Hills",
                "country": "États-Unis"
            },
            {
                "nom": "Peichert",
                "prenom": "Anne",
                "login": "louane",
                "email": "louane@gmail.com",
                "birthday": "1996-11-26",
                "age": 20,
                "passwd": "8d78ad13452b39de768806c1bbc0225cff2608a726003310c329edbacbbb694c7965f3eccfea1508ac0b8debe7cbe8087993bb617ffd0f23acb3140f3df06f6c",
                "cle": "s6nugj39vnqdq",
                "active": 1,
                "sex": 2,
                "orientation": 1,
                "bio": "Besoin d'experiences !",
                "address": "Villa Mederic Louane 3 rue des pyramides 75001 Paris",
                "lat": 48.8643211,
                "lng": 2.3323676999999634,
                "city": "Paris",
                "country": "France"
            },
            {
                "nom": "Dujardin",
                "prenom": "Jean",
                "login": "jean",
                "email": "j.dujardin@gmail.com",
                "birthday": "1972-06-19",
                "age": 44,
                "passwd": "8d78ad13452b39de768806c1bbc0225cff2608a726003310c329edbacbbb694c7965f3eccfea1508ac0b8debe7cbe8087993bb617ffd0f23acb3140f3df06f6c",
                "cle": "s6nugj39vnqdq",
                "active": 1,
                "sex": 1,
                "orientation": 3,
                "bio": "Alex tu me manque T_T, besoin de reconfort !",
                "address": "R & D - Société d'Avocats 28 avenue de Messine 75008 Paris France",
                "lat": 48.8771133,
                "lng": 2.3120758000000023,
                "city": "Paris",
                "country": "France"
            },
            {
                "nom": "Marsal",
                "prenom": "Jean-Baptiste",
                "login": "jibe",
                "email": "jb.marsal@gmail.com",
                "birthday": "1985-10-23",
                "age": 31,
                "passwd": "8d78ad13452b39de768806c1bbc0225cff2608a726003310c329edbacbbb694c7965f3eccfea1508ac0b8debe7cbe8087993bb617ffd0f23acb3140f3df06f6c",
                "cle": "s6nugj39vnqdq",
                "active": 1,
                "sex": 1,
                "orientation": 3,
                "bio": "Aime ce qu'il fait !"
            }
        ];
        this.countUsers = this.basicUsers.length;
        this.src = [
            [
                "https://www.quizz.biz/uploads/quizz/751751/4_aq48D.jpg",
                "https://www.elheraldo.co/sites/default/files/styles/width_860/public/foto/2016/12/26/angelina-jolie1.jpg",
                "http://ekladata.com/dpCV8zc2maexa6oZnKt194gqKoE.jpg",
                "https://media.giphy.com/media/129L03GxP853vW/giphy.gif",
                "https://media.giphy.com/media/ridlFwGcBgP1C/giphy.gif"
            ],
            [
                "http://baomoi-photo-3-td.zadn.vn/15/11/25/139/18070073/9_58951.jpg",
                "https://s-media-cache-ak0.pinimg.com/736x/7e/a4/f4/7ea4f4c1dc642981407b4bfc2a47f764.jpg",
                "https://s-media-cache-ak0.pinimg.com/originals/89/48/6a/89486a05dbddb26aab6b7db4378596d6.jpg",
                "http://img.viva.ua/pictures/content/12/12008.jpg",
                "https://media.giphy.com/media/3aX8uXXw6Nf6U/giphy.gif"
            ],
            [
                "http://cdn4.spiegel.de/images/image-546203-galleryV9-fgyc-546203.jpg",
                "http://www.topontiki.gr/sites/default/files/article/2016-12/madonna.jpg",
                "https://media.licdn.com/mpr/mpr/shrinknp_800_800/AAEAAQAAAAAAAAbNAAAAJDhlNzhjM2FkLTMwZjUtNGU3ZS05NmRmLTY5MmNiY2IwMWUzZA.png",
                "http://www.tdance.ru/upload/iblock/78f/78f504823fca515894e64f2678e611a4.jpg",
                "https://media.giphy.com/media/CobcjsgxDM3BK/giphy.gif"
            ],
            [
                "http://v2mike.info/wp-content/uploads/2017/02/decor-de-table-anniversaire-16-saint-denis-decor-jardin-champenoux-marche-de-noel-2016-discount-rideaux-21164906-place-ahurissant-deco-zen-a-faire-bois-diy-gifi-ikea-mais.jpg",
                "http://resize2-parismatch.ladmedia.fr/r/625,417,center-middle,ffffff/img/var/news/storage/images/paris-match/brouillons/louane-se-confie-sur-ses-parents-decedes-899159/9527503-1-fre-FR/Louane-se-confie-sur-ses-parents-decedes.jpg",
                "http://minute-people.fr/upload/media/entries/2017-03/24/32-18-c357fa2885588e870d75d39c3e470058.jpg",
                "http://breakforbuzz.com/wp-content/uploads/2015/11/maxpeopleworld858298.jpg",
                "https://media.giphy.com/media/NVTaWrYVbjBZK/giphy.gif"
            ],
            [
                "https://s-media-cache-ak0.pinimg.com/736x/ee/c5/bd/eec5bd8f1c8964cd4810c981f2ae337c.jpg",
                "http://www.celebres.fr/wp-content/uploads/2016/04/l-acteur-jean-dujardin-800x445.jpg",
                "http://img.voi.pmdstatic.net/fit/http.3A.2F.2Fwww.2Evoici.2Efr.2Fvar.2Fvoi.2Fstorage.2Fimages.2Fmedia.2Fmultiupload-du-30-octobre-2012.2F1-jean-dujardin.2F8390024-1-fre-FR.2F1-jean-dujardin.2Ejpg/1237x693/quality/80/1-jean-dujardin.jpg",
                "http://s1.lemde.fr/image/2010/12/08/696x348/1450891_3_714b_jean-dujardin-et-marie-josee-croze-dans-le.jpg",
                "https://media.giphy.com/media/bHgMGOuZGs8SI/giphy.gif"
            ]
        ];
        this.basicPhotos = [];
    }

    insertData() {
        return this.addUsers()
            .then((status) => {
                if (!status[0]) {
                    throw new Error("E_INSERTED");
                }
            })
            .then(() => {
                return this.makefoldersPhoto();
            })
            .then(() => {
                return this.addTags();
            })
            .then(() => {
                return this.addPhotosToFolderUsers();
            })
            .then(() => {
                return this.addPhotosFromFolderInDb();
            })
            .then(() => {
                return this.addPhotos();
            })
            .then(() => {
                return this.addTagsToUser();
            })
            .catch((err) => {
                if (err.message !== "E_INSERTED") {
                    throw (err);
                }
            });
    }

    addTags() {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO tags (tag) VALUES ("${ this.basicTags.join('"), ("') }");`;

            connection.query(sql, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        })
    }

    addUsers() {
        return Promise.all(this.basicUsers.map((user) => {
            return UserModel.newUser(user);
        }));
    }

    addPhotos() {
        return new Promise((resolve) => {
            this.basicPhotos.map((photo) => {
                UserModel.addPhotoProfil(photo);
            });
            resolve();
        });
    }

    addTagsToUser() {
        return new Promise((resolve) => {
            this.selectIdFromUsers()
                .then((rowUsers) => {
                    if (rowUsers !== false) {
                        return this.nbUsers = rowUsers;
                    }
                })
                .then((nbUsers) => {
                    if (nbUsers) {
                        return this.checkIfTagsUsersAndCreateIt(nbUsers);
                    }
                })
                .then(() => {
                    resolve();
                }).catch((err) => {
                console.error(err);
            });
        });
    }

    checkIfTagsUsersAndCreateIt(nbUsers) {
        return this.getRandomTagsForUsers(nbUsers)
            .then((randomTags) => {
                return this.insertRandomTagsToDb(randomTags);
            })
            ;
    }

    insertRandomTagsToDb(randomTags) {
        return new Promise((resolve, reject) => {
            let sql = "INSERT INTO tags_user SET ?";

            randomTags.map((tag) => {
                connection.query(sql, [{
                    "id_user": tag.id_user,
                    "tag": tag.tag
                }], (err) => {
                    if (err) {
                        reject(err);
                    }
                });
            });
            resolve();
        });
    }

    getRandomTagsForUsers(nbUsers) {
        return new Promise((resolve) => {
            let randomTags = [],
                tag = "",
                idUser = 1;
            ;

            while (idUser <= nbUsers) {
                let tmpTags = [];

                for (let nbTags = 0; nbTags < 6; nbTags++) {
                    while (tmpTags.indexOf(tag = (this.getRandomTag())) > -1);
                    tmpTags.push(tag);
                }
                randomTags = [
                    ...randomTags,
                    ...tmpTags.map((tag) => {
                        return {
                            tag: tag,
                            id_user: idUser,
                        };
                    })
                ];
                idUser++;
            }
            resolve(randomTags);
        });
    }

    getRandomTag() {
        return this.basicTags[Math.round(Math.random() * (this.basicTags.length))];
    }

    selectIdFromUsers() {
        return new Promise((resolve, reject) => {
            let sql = "SELECT id FROM users";

            connection.query(sql, (err, res) => {
                if (err) {
                    reject(err);
                }
                if (res.length) {
                    resolve(res.length);
                } else {
                    resolve(false);
                }
            });
        })
    }

    makefoldersPhoto() {
        return Promise.all(this.basicUsers.map((user, index) => {
            return makeDir('./public/profils/' + (index + 1));
        }));
    }

    addPhotosToFolderUsers() {
        let promisesDownload = [];

        this.src.map((paths, index) => {
            let tmpPromises = paths.map((path, nb) => {
                let extension = Helper.getExtension(path),
                    dest = "./public/profils/" + (index + 1) + "/" + nb + extension
                ;

                return download(path).then(data => {
                    fs.writeFileSync(dest, data);
                });
            });
            promisesDownload = [
                ...promisesDownload,
                ...tmpPromises
            ];
        });

        return Promise.all(promisesDownload);
    }

    addPhotosFromFolderInDb() {
        return new Promise((resolve, reject) => {

            for (let userId = 1; userId < (this.countUsers); userId++) {
                let path = "./public/profils/" + userId + "/",
                    tmpArray = fs.readdirSync(path);

                tmpArray.map((source) => {
                    this.basicPhotos.push({
                            'id_user': userId,
                            'src_photo': source,
                            'photo_profil': 0
                        }
                    );
                });
            }
            resolve();
        });
    }
}
module.exports = SeedAccount;