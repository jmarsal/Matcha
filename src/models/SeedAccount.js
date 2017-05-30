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
        Promise.all([
            this.addUsers(),
            this.makefoldersPhoto()
        ]).then(() => {
            Promise.all([
                this.addTags(),
                this.addPhotos()
            ]).then((value) => {
                this.selectIdFromUsers() // pour test mais a supprimer
                // console.log(value);
                // this.addTagsToUser()
                //     .then((res) => {
                //         console.log('resolve addTagsToUser');
                //         console.log(res);
                //     }).catch((err) => {
                //     console.error(err);
                // });
            }).catch((err) => {
                console.error(err);
            });
        });
    }

    addTags() {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < this.basicTags.length; i++) {
                let sql = "SELECT tag FROM tags WHERE tag = ?";

                connection.query(sql, [this.basicTags[i]], (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    if (!res.length) {
                        sql = "INSERT INTO tags SET ?";

                        connection.query(sql, [{"tag": this.basicTags[i]}], (err) => {
                            if (err) {
                                reject(err);
                            }
                        });
                    }
                });
                if (i + 1 === this.basicTags.length) {
                    resolve();
                }
            }
        })
    }

    addUsers() {
        return new Promise((resolve, reject) => {
            let allUser = [];

            for (let i = 0; i < this.basicUsers.length; i++) {
                allUser[i] = UserModel.newUser(this.basicUsers[i]);
            }
            Promise.all([
                allUser
            ]).then((value) => {
                console.log(value)
                resolve();
            }).catch((err) => {
                reject(err);
            })
        });
    }

    addPhotos() {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < this.basicPhotos.length; i++) {
                let sql = "SELECT src_photo FROM users_photos_profils WHERE src_photo = ?";

                connection.query(sql, [this.basicPhotos[i].src_photo], (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    if (!res.length) {
                        UserModel.addPhotoProfil(this.basicPhotos[i]);
                    }
                });
                if (i + 1 === this.basicPhotos.length) {
                    resolve();
                }
            }
        });
    }

    addTagsToUser() {
        return new Promise((resolve, reject) => {
            this.selectIdFromUsers()
                .then((rowUsers) => {
                    if (rowUsers !== false) {
                        this.nbUsers = rowUsers;
                        this.checkIfTagsUsersAndCreateIt()
                            .then(() => {
                                console.log('tous les tags sont inseres dans la db!');
                            }).catch((err) => {
                            console.error(err);
                        })
                    } else {
                        console.error("Probleme pour recuperer le nb d'users dans la db!");
                    }
                }).catch((err) => {
                console.error(err);
            });
        });
    }

    checkIfTagsUsersAndCreateIt() {
        return new Promise((resolve, reject) => {
            let finish = 0,
                i = 1
            ;

            while (i < this.nbUsers) {
                let randomTags = [{
                        "id_user": "",
                        "tag": ""
                    }],
                    sql = "SELECT tag FROM tags_user WHERE id_user = ?";

                connection.query(sql, [i], (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (!res.length) {
                            this.getRandomTagsForUsers(randomTags, i)
                                .then((resRand) => {
                                    if (resRand !== false) {
                                        randomTags = resRand;
                                        this.insertRandomTagsToDb(randomTags, res.length, i)
                                            .then(() => {
                                                i++;
                                            }).catch((err) => {
                                            console.error(err);
                                        });
                                    } else {
                                        console.error('Probleme avec le random des tags Users!');
                                    }
                                }).catch((err) => {
                                console.error(err);
                            })

                        }
                    }
                });
                finish = i;
            }
            if (finish + 1 == this.nbUsers) {
                resolve();
            }
        });
    }

    insertRandomTagsToDb(randomTags) {
        return new Promise((resolve, reject) => {
            let j = 0;

            while (j < randomTags.length) {
                let sql = "INSERT INTO tags_user SET ?";

                connection.query(sql, [{
                    "id_user": randomTags[j].id_user,
                    "tag": randomTags[j].tag
                }], (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        j++;
                    }
                });
            }
            if (j + 1 == randomTags.tag.length) {
                resolve();
            }
        });
    }

    getRandomTagsForUsers(randomTags, i) {
        return new Promise((resolve) => {

            for (let nbTags = 0; nbTags < 6; nbTags++) {
                randomTags[nbTags].tag = this.basicTags[Math.floor(Math.random() * this.basicTags.length)];
                while (randomTags[nbTags].tag === "undefined") {
                    randomTags[nbTags].tag = this.basicTags[Math.floor(Math.random() * this.basicTags.length)];
                }
                randomTags[nbTags].id_user = i;
            }
            if (randomTags.length == 5) {
                resolve(randomTags);
            } else {
                resolve(false);
            }
        })
    }

    selectIdFromUsers() {
        return new Promise((resolve, reject) => {
            let sql = "SELECT id FROM users";

            connection.query(sql, (err, res) => {
                if (err) {
                    reject(err);
                }
                console.log(res.length);
                if (res.length) {
                    resolve(res.length);
                } else {
                    resolve(false);
                }
            });
        })
    }

    makefoldersPhoto() {
        return new Promise((resolve, reject) => {
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