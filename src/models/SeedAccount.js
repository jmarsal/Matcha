/**
 * Created by jmarsal on 5/29/17.
 */

const UserModel = require('../models/UserModel');
const Database = require('../core/Database');
const fs = require('fs-extra')

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
        this.basicPhotos = [
            {
                'id_user': 1,
                'src_photo': "/profils/1/angel.jpg",
                'photo_profil': 1
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
            },
            {
                'id_user': 2,
                'src_photo': "/profils/2/jalba1.jpg"
            },
            {
                'id_user': 2,
                'src_photo': "/profils/2/jalba2.jpg",
                'photo_profil': 1
            },
            {
                'id_user': 2,
                'src_photo': "/profils/2/jalba3.jpg"
            },
            {
                'id_user': 2,
                'src_photo': "/profils/2/jalba4.jpg"
            },
            {
                'id_user': 2,
                'src_photo': "/profils/2/jalba5.gif"
            },
            {
                'id_user': 3,
                'src_photo': "/profils/3/madonna1.jpg"
            },
            {
                'id_user': 3,
                'src_photo': "/profils/3/madonna2.jpg"
            },
            {
                'id_user': 3,
                'src_photo': "/profils/3/madonna3.jpg"
            },
            {
                'id_user': 3,
                'src_photo': "/profils/3/madonna4.jpg",
                'photo_profil': 1
            },
            {
                'id_user': 3,
                'src_photo': "/profils/3/madonna5.gif"
            },
            {
                'id_user': 4,
                'src_photo': "/profils/4/louane1.jpg"
            },
            {
                'id_user': 4,
                'src_photo': "/profils/4/louane2.jpg"
            },
            {
                'id_user': 4,
                'src_photo': "/profils/4/louane3.png",
                'photo_profil': 1
            },
            {
                'id_user': 4,
                'src_photo': "/profils/4/louane4.jpg"
            },
            {
                'id_user': 4,
                'src_photo': "/profils/4/louane5.gif"
            },
            {
                'id_user': 5,
                'src_photo': "/profils/5/jdujardin1.jpg",
                'photo_profil': 1
            },
            {
                'id_user': 5,
                'src_photo': "/profils/5/jdujardin2.jpg"
            },
            {
                'id_user': 5,
                'src_photo': "/profils/5/jdujardin3.jpg"
            },
            {
                'id_user': 5,
                'src_photo': "/profils/5/jdujardin4.jpg"
            },
            {
                'id_user': 5,
                'src_photo': "/profils/5/jdujardin5.gif"
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

    addPhotosToFolderUsers() {
        const src = "./public/images/images-seeders/",
            dst = "./public/profils/",
            array = [
                {
                    source: src + 'Angel/angel.jpg',
                    dest: dst + '1/angel.jpg'
                },
                {
                    source: src + 'Angel/angel1.jpg',
                    dest: dst + '1/angel1.jpg'
                },
                {
                    source: src + 'Angel/angel2.jpg',
                    dest: dst + '1/angel2.jpg'
                },
                {
                    source: src + 'Angel/angel-gif.gif',
                    dest: dst + '1/angel-gif.gif'
                },
                {
                    source: src + 'Angel/angel-gif2.gif',
                    dest: dst + '1/angel-gif2.gif'
                },
                {
                    source: src + 'jAlba/jalba1.jpg',
                    dest: dst + '2/jalba1.jpg'
                },
                {
                    source: src + 'jAlba/jalba2.jpg',
                    dest: dst + '2/jalba2.jpg'
                },
                {
                    source: src + 'jAlba/jalba3.jpg',
                    dest: dst + '2/jalba3.jpg'
                },
                {
                    source: src + 'jAlba/jalba4.jpg',
                    dest: dst + '2/jalba4.jpg'
                },
                {
                    source: src + 'jAlba/jalba5.gif',
                    dest: dst + '2/jalba5.gif'
                },
                {
                    source: src + 'Madonna/madonna1.jpg',
                    dest: dst + '3/madonna1.jpg'
                },
                {
                    source: src + 'Madonna/madonna2.jpg',
                    dest: dst + '3/madonna2.jpg'
                },
                {
                    source: src + 'Madonna/madonna3.jpg',
                    dest: dst + '3/madonna3.jpg'
                },
                {
                    source: src + 'Madonna/madonna4.jpg',
                    dest: dst + '3/madonna4.jpg'
                },
                {
                    source: src + 'Madonna/madonna5.gif',
                    dest: dst + '3/madonna5.gif'
                },
                {
                    source: src + 'Louane/louane1.jpg',
                    dest: dst + '4/louane1.jpg'
                },
                {
                    source: src + 'Louane/louane2.jpg',
                    dest: dst + '4/louane2.jpg'
                },
                {
                    source: src + 'Louane/louane3.png',
                    dest: dst + '4/louane3.png'
                },
                {
                    source: src + 'Louane/louane4.jpg',
                    dest: dst + '4/louane4.jpg'
                },
                {
                    source: src + 'Louane/louane5.gif',
                    dest: dst + '4/louane5.gif'
                },
                {
                    source: src + 'jDujardin/jdujardin1.jpg',
                    dest: dst + '5/jdujardin1.jpg'
                },
                {
                    source: src + 'jDujardin/jdujardin2.jpg',
                    dest: dst + '5/jdujardin2.jpg'
                },
                {
                    source: src + 'jDujardin/jdujardin3.jpg',
                    dest: dst + '5/jdujardin3.jpg'
                },
                {
                    source: src + 'jDujardin/jdujardin4.jpg',
                    dest: dst + '5/jdujardin4.jpg'
                },
                {
                    source: src + 'jDujardin/jdujardin5.gif',
                    dest: dst + '5/jdujardin5.gif'
                }
            ]
        ;

        return Promise.all(array.map((photo) => {
            return fs.copy(photo.source, photo.dest);
        }));
    }
}
module.exports = SeedAccount;