/**
 * Created by jmarsal on 5/29/17.
 */

const UserModel = require('../models/UserModel');
const Database = require('../core/Database');
const Helper = require('../core/Helpers');

// const uniqueRandomArray = require('unique-random-array');
const makeDir = require('make-dir');

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
                "passwd": "8d78ad13452b39de768806c1bbc0225cff2608a726003310c329edbacbbb694c7965f3eccfea1508ac0b8debe7cbe8087993bb617ffd0f23acb3140f3df06f6c",
                "cle": "s6nugj39vnqdq",
                "active": 1,
                "sex": 2,
                "orientation": 1,
                "bio": "Cherche acteur plein de fric pour penser à autre chose que Brad...",
                "adress": "9200 Sunset Blvd.Suite 550 West Hollywood, CA 90069",
                "lat": 34.0898242,
                "lng": -118.39271339999999
            },
            {
                "nom": "Alba",
                "prenom": "Jessica",
                "login": "jAlba",
                "email": "jessica.alba@gmail.com",
                "passwd": "8d78ad13452b39de768806c1bbc0225cff2608a726003310c329edbacbbb694c7965f3eccfea1508ac0b8debe7cbe8087993bb617ffd0f23acb3140f3df06f6c",
                "cle": "s6nugj39vnqdq",
                "active": 1,
                "sex": 2,
                "orientation": 2,
                "bio": "Envie de me detendre apres un tournage...",
                "adress": "3 Arts Entertainment 9460 Wilshire Blvd. 7th Floor Beverly Hills, CA 90212",
                "lat": 34.066745,
                "lng": -118.3993524
            },
            {
                "nom": "Ciccone",
                "prenom": "Madonna Louise",
                "login": "madonna",
                "email": "madonna@gmail.com",
                "passwd": "8d78ad13452b39de768806c1bbc0225cff2608a726003310c329edbacbbb694c7965f3eccfea1508ac0b8debe7cbe8087993bb617ffd0f23acb3140f3df06f6c",
                "cle": "s6nugj39vnqdq",
                "active": 1,
                "sex": 2,
                "orientation": 1,
                "bio": "Trup est president, alors je me met au travail...",
                "adress": "Untitled Entertainment 350 S. Beverly Dr. Suite 200 Beverly Hills, CA 90212 USA",
                "lat": 34.0604857,
                "lng": -118.39866840000002
            },
            {
                "nom": "Peichert",
                "prenom": "Anne",
                "login": "louane",
                "email": "louane@gmail.com",
                "passwd": "8d78ad13452b39de768806c1bbc0225cff2608a726003310c329edbacbbb694c7965f3eccfea1508ac0b8debe7cbe8087993bb617ffd0f23acb3140f3df06f6c",
                "cle": "s6nugj39vnqdq",
                "active": 1,
                "sex": 2,
                "orientation": 1,
                "bio": "Besoin d'experience !",
                "adress": "Villa Mederic Louane 3 rue des pyramides 75001 Paris",
                "lat": 48.8643211,
                "lng": 2.3323676999999634
            },
            {
                "nom": "Dujardin",
                "prenom": "Jean",
                "login": "jean",
                "email": "j.dujardin@gmail.com",
                "passwd": "8d78ad13452b39de768806c1bbc0225cff2608a726003310c329edbacbbb694c7965f3eccfea1508ac0b8debe7cbe8087993bb617ffd0f23acb3140f3df06f6c",
                "cle": "s6nugj39vnqdq",
                "active": 1,
                "sex": 1,
                "orientation": 3,
                "bio": "Alex tu me manque T_T, besoin de reconfort !",
                "adress": "R & D - Société d'Avocats 28 avenue de Messine 75008 Paris France",
                "lat": 48.8771133,
                "lng": 2.3120758000000023
            },
            {
                "nom": "Marsal",
                "prenom": "Jean-Baptiste",
                "login": "jibe",
                "email": "jb.marsal@gmail.com",
                "passwd": "8d78ad13452b39de768806c1bbc0225cff2608a726003310c329edbacbbb694c7965f3eccfea1508ac0b8debe7cbe8087993bb617ffd0f23acb3140f3df06f6c",
                "cle": "s6nugj39vnqdq",
                "active": 1,
                "sex": 1,
                "orientation": 3,
                "bio": "Aime ce qu'il fait !"
            }
        ];
        this.countUsers = this.basicUsers.length;
        this.basicPhotos = [
            {
                'id_user': 1,
                'src_photo': "/profils/1/angel.jpg"
            },
            {
                'id_user': 1,
                'src_photo': "/profils/1/angel1.jpg"
            },
            {
                'id_user': 1,
                'src_photo': "/profils/1/angel2.jpg"
            },
            {
                'id_user': 1,
                'src_photo': "/profils/1/angel-gif2.gif"
            },
            {
                'id_user': 1,
                'src_photo': "/profils/1/angel-gif.gif"
            }
        ];
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
                return this.addPhotos();
            })
            .then(() => {
                return this.addTagsToUser();
            })
            .catch((err) => {
                if (err.message !== "E_INSERTED") {
                    throw (err);
                } else {
                    console.log('Users Already In The DataBase !');
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
        return new Promise((resolve) => {
            let makeFolders = [];

            for (let i = 1; i <= this.countUsers; i++) {
                makeFolders[i] = makeDir('./public/profils/' + i);
            }

            Promise.all([
                makeFolders
            ]).then(() => {
                resolve();
            }).catch((err) => {
                console.error(err);
            })
        })
    }
}
module.exports = SeedAccount;