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
					' DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
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
				'nom VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL ,' +
				'prenom VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL ,' +
				'login VARCHAR(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,' +
				'email VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,' +
				'age SMALLINT DEFAULT 18,' +
				'passwd VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,' +
				'cle VARCHAR(255) DEFAULT NULL,' +
				'active BOOLEAN DEFAULT 0,' +
				'sex SMALLINT DEFAULT 2,' +
				'orientation SMALLINT DEFAULT 3,' +
				'bio TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,' +
				'address VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,' +
				'lat FLOAT(10, 6) DEFAULT NULL,' +
				'lng FLOAT(10, 6) DEFAULT NULL,' +
				'city VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,' +
				'country VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,' +
				'popularity INT DEFAULT 0,' +
				'notifications INT DEFAULT 0,' +
				'vues INT DEFAULT 0,' +
				'disconnect DATETIME DEFAULT NOW(),' +
				'nbUsersMatch INT DEFAULT 0' +
				') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
			const userPhotos =
				'CREATE TABLE IF NOT EXISTS users_photos_profils' +
				'(' +
				'id INT PRIMARY KEY AUTO_INCREMENT,' +
				'id_user INT NOT NULL,' +
				'src_photo VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,' +
				'photo_profil BOOLEAN DEFAULT 0' +
				') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
			const tagsUser =
				'CREATE TABLE IF NOT EXISTS tags_user' +
				'(' +
				'id INT PRIMARY KEY AUTO_INCREMENT,' +
				'id_user INT NOT NULL,' +
				'tag VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL' +
				') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
			const tags =
				'CREATE TABLE IF NOT EXISTS tags' +
				'(' +
				'id INT PRIMARY KEY AUTO_INCREMENT,' +
				'tag VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL' +
				') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
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
				') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
			const userNotifications =
				'CREATE TABLE IF NOT EXISTS user_notifications' +
				'(' +
				'id INT PRIMARY KEY AUTO_INCREMENT,' +
				'id_user INT NOT NULL,' +
				'login_user_visit VARCHAR(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,' +
				'id_user_visit INT NOT NULL,' +
				'photo_user_visit VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT "/images/upload/default-user.png",' +
				'date_visit DATETIME NOT NULL,' +
				'action VARCHAR(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,' +
				'likeUnlike BOOLEAN DEFAULT true' +
				') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
			const userLikes =
				'CREATE TABLE IF NOT EXISTS user_likes' +
				'(' +
				'id INT PRIMARY KEY AUTO_INCREMENT,' +
				'id_user INT NOT NULL,' +
				'id_user_like INT NOT NULL,' +
				'matcha_like BOOLEAN DEFAULT false' +
				') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
			const reportLock =
				'CREATE TABLE IF NOT EXISTS report_lock' +
				'(' +
				'id INT PRIMARY KEY AUTO_INCREMENT,' +
				'id_user INT NOT NULL,' +
				'id_user_lock INT NOT NULL,' +
				'action VARCHAR(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL' +
				') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
			const connectUsers =
				'CREATE TABLE IF NOT EXISTS connect_users' +
				'(' +
				'id INT PRIMARY KEY AUTO_INCREMENT,' +
				'id_user1 INT NOT NULL,' +
				'login_user1 VARCHAR(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,' +
				'photo_user1 VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT "/images/upload/default-user.png",' +
				'id_user2 INT NOT NULL,' +
				'login_user2 VARCHAR(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,' +
				'photo_user2 VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT "/images/upload/default-user.png"' +
				') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
			const chatHistory =
				'CREATE TABLE IF NOT EXISTS chat_history' +
				'(' +
				'id INT PRIMARY KEY AUTO_INCREMENT,' +
				'id_user1 INT NOT NULL,' +
				'id_user2 INT NOT NULL,' +
				'from_user INT NOT NULL,' +
				'message MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,' +
				'date DATETIME NOT NULL' +
				') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
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
																			connection.query(connectUsers, (err) => {
																				if (err) {
																					reject(err);
																				} else {
																					connection.query(chatHistory, (err) => {
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
				port: setPort,
				charset: "utf8mb4"
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
