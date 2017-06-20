/**
 * Created by jbmar on 07/05/2017.
 */

const mysql = require('mysql');

class Database {
	constructor() {
		this.nameDb = nameDb;
		this.connection = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: 'root',
			port: setPort
		});
		this.connection.connect((err) => {
			if (err) {
				console.error(err);
				console.error('La connection avec le serveur MySQL est impossible dans la class Database');
				process.exit(1);
			}
		});
	}

	createDb() {
		return new Promise((resolve, reject) => {
			this.connection.query(
				'CREATE DATABASE IF NOT EXISTS ' +
					this.nameDb +
					' DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci',
				(err) => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				}
			);
		});
	}

	createTables() {
		return new Promise((resolve, reject) => {
			const users =
				'CREATE TABLE IF NOT EXISTS users' +
				'(' +
				'id INT PRIMARY KEY AUTO_INCREMENT,' +
				'nom VARCHAR(255) DEFAULT NULL,' +
				'prenom VARCHAR(255) DEFAULT NULL,' +
				'login VARCHAR(16) DEFAULT NULL,' +
				'email VARCHAR(255) DEFAULT NULL,' +
				'birthday VARCHAR(10) DEFAULT "1901-01-01",' +
				'age SMALLINT DEFAULT 116,' +
				'passwd VARCHAR(255) DEFAULT NULL,' +
				'cle VARCHAR(255) DEFAULT NULL,' +
				'active BOOLEAN DEFAULT 0,' +
				'sex SMALLINT DEFAULT 2,' +
				'orientation SMALLINT DEFAULT 3,' +
				'bio TEXT DEFAULT NULL,' +
				'address VARCHAR(255) DEFAULT NULL,' +
				'lat FLOAT(10, 6) DEFAULT NULL,' +
				'lng FLOAT(10, 6) DEFAULT NULL,' +
				'city VARCHAR(150) DEFAULT NULL,' +
				'country VARCHAR(150) DEFAULT NULL,' +
				'popularity INT DEFAULT 0,' +
				'notifications INT DEFAULT 0,' +
				'vues INT DEFAULT 0,' +
				'disconnect DATETIME DEFAULT NOW(),' +
				'nbUsersMatch INT DEFAULT 0' +
				')';
			const userPhotos =
				'CREATE TABLE IF NOT EXISTS users_photos_profils' +
				'(' +
				'id INT PRIMARY KEY AUTO_INCREMENT,' +
				'id_user INT NOT NULL,' +
				'src_photo VARCHAR(255) NOT NULL,' +
				'photo_profil BOOLEAN DEFAULT 0' +
				')';
			const tagsUser =
				'CREATE TABLE IF NOT EXISTS tags_user' +
				'(' +
				'id INT PRIMARY KEY AUTO_INCREMENT,' +
				'id_user INT NOT NULL,' +
				'tag VARCHAR(150) NOT NULL' +
				')';
			const tags =
				'CREATE TABLE IF NOT EXISTS tags' +
				'(' +
				'id INT PRIMARY KEY AUTO_INCREMENT,' +
				'tag VARCHAR(150) NOT NULL' +
				')';
			const userInteracts =
				'CREATE TABLE IF NOT EXISTS user_interacts' +
				'(' +
				'id INT PRIMARY KEY AUTO_INCREMENT,' +
				'id_user_session INT NOT NULL,' +
				'id_user INT NOT NULL,' +
				'distanceFromUser INT DEFAULT NULL,' +
				'distanceFromUserKm INT DEFAULT NULL,' +
				'tagsCommun INT DEFAULT 0,' +
				'locked BOOLEAN DEFAULT false,' +
				'vue BOOLEAN DEFAULT false' +
				')';
			const userNotifications =
				'CREATE TABLE IF NOT EXISTS user_notifications' +
				'(' +
				'id INT PRIMARY KEY AUTO_INCREMENT,' +
				'id_user INT NOT NULL,' +
				'login_user_visit VARCHAR(16) NOT NULL,' +
				'id_user_visit INT NOT NULL,' +
				'photo_user_visit VARCHAR(255) DEFAULT "/images/upload/default-user.png",' +
				'date_visit DATETIME NOT NULL,' +
				'action VARCHAR(16) NOT NULL,' +
				'likeUnlike BOOLEAN DEFAULT true' +
				')';
			const userLikes =
				'CREATE TABLE IF NOT EXISTS user_likes' +
				'(' +
				'id INT PRIMARY KEY AUTO_INCREMENT,' +
				'id_user INT NOT NULL,' +
				'id_user_like INT NOT NULL,' +
				'matcha_like BOOLEAN DEFAULT false' +
				')';
			const reportLock =
				'CREATE TABLE IF NOT EXISTS report_lock' +
				'(' +
				'id INT PRIMARY KEY AUTO_INCREMENT,' +
				'id_user INT NOT NULL,' +
				'id_user_lock INT NOT NULL,' +
				'action VARCHAR(16) NOT NULL' +
				')';
			connection.query(users, (err) => {
				if (err) {
					reject(err);
				} else {
					connection.query(userPhotos, (err) => {
						if (err) {
							reject(err);
						} else {
							connection.query(tagsUser, (err) => {
								if (err) {
									reject(err);
								} else {
									connection.query(tags, (err) => {
										if (err) {
											reject(err);
										} else {
											connection.query(userInteracts, (err) => {
												if (err) {
													reject(err);
												} else {
													connection.query(userNotifications, (err) => {
														if (err) {
															reject(err);
														} else {
															connection.query(userLikes, (err) => {
																if (err) {
																	reject(err);
																} else {
																	connection.query(reportLock, (err) => {
																		if (err) {
																			reject(err);
																		} else {
																			resolve();
																		}
																	});
																}
															});
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		});
	}

	connectDb() {
		return new Promise((resolve, reject) => {
			global.connection = mysql.createConnection({
				host: 'localhost',
				user: 'root',
				password: 'root',
				database: nameDb,
				port: setPort
			});

			connection.connect((err) => {
				if (err) {
					console.error(err);
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
}

module.exports = Database;
