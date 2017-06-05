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
        this.basicTags = require('../core/Seeders/tags');
        this.basicUsers = require('../core/Seeders/seeders');
        this.countUsers = this.basicUsers.length;
        this.pathsPhotosUsers = require('../core/Seeders/pathsPhotosSeeders');
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

        this.pathsPhotosUsers.map((paths, index) => {
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
                    tmpArray = fs.readdirSync(path),
                    randPhotoProfil = Math.round(Math.random() * (tmpArray.length - 1))
                ;

                tmpArray.map((source, index) => {
                    this.basicPhotos.push({
                            'id_user': userId,
                            'src_photo': path.replace("./public/", "/") + source,
                            'photo_profil': (index === randPhotoProfil) ? 1 : 0
                        }
                    );
                });
            }
            resolve();
        });
    }
}
module.exports = SeedAccount;