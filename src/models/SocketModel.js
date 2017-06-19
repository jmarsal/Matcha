class SocketModel {
	static addNewVisitToDb(myId, myLogin, idUserToVisit) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT src_photo FROM users_photos_profils WHERE id_user = ? && photo_profil = 1',
				photoProfilSrc = '/images/upload/default-user.png';

			connection.query(sql, myId, (err, res) => {
				if (err) {
					reject(err);
				} else {
					if (res[0] && (res[0].src_photo !== '/images/upload/default-user.png' || res[0].src_photo !== '')) {
						photoProfilSrc = res[0].src_photo;
					}
					sql =
						'INSERT INTO user_notifications(photo_user_visit, id_user, login_user_visit, id_user_visit, date_visit, action) VALUES(?, ?, ?, ?, NOW(), ?)';
					connection.query(sql, [ photoProfilSrc, idUserToVisit, myLogin, myId, 'visit' ], (err) => {
						if (err) {
							reject(err);
						} else {
							sql = 'UPDATE users SET notifications = notifications + 1 WHERE id = ?';

							connection.query(sql, [ idUserToVisit ], (err) => {
								if (err) {
									reject(err);
								}
								resolve();
							});
						}
					});
				}
			});
		});
	}

	static addDisconnectToDb(idUser) {
		return new Promise((resolve, reject) => {
			let sql = 'UPDATE users SET disconnect = NOW() ' + 'WHERE id = ?';

			connection.query(sql, idUser, (err) => {
				if (err) {
					reject(err);
				}
				resolve();
			});
		});
	}

	static addNewLikeToDb(myId, myLogin, idUserToVisit) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT src_photo FROM users_photos_profils WHERE id_user = ? && photo_profil = 1',
				photoProfilSrc = '/images/upload/default-user.png';

			connection.query(sql, myId, (err, res) => {
				if (err) {
					reject(err);
				} else {
					if (res[0] && (res[0].src_photo !== '/images/upload/default-user.png' || res[0].src_photo !== '')) {
						photoProfilSrc = res[0].src_photo;
					}
					sql =
						'INSERT INTO user_notifications(photo_user_visit, id_user, login_user_visit, id_user_visit, date_visit, action) VALUES(?, ?, ?, ?, NOW(), ?)';
					connection.query(sql, [ photoProfilSrc, idUserToVisit, myLogin, myId, 'like' ], (err) => {
						if (err) {
							reject(err);
						} else {
							sql = 'UPDATE users SET notifications = notifications + 1 WHERE id = ?';

							connection.query(sql, [ idUserToVisit ], (err) => {
								if (err) {
									reject(err);
								} else {
									sql = 'SELECT matcha_like FROM user_likes WHERE id_user_like = ? && id_user = ?';

									connection.query(sql, [ myId, idUserToVisit ], (err, res) => {
										if (err) {
											reject(err);
										}
										if (res.length) {
											sql = 'DELETE FROM user_likes WHERE id_user = ? && id_user_like = ?';

											connection.query(sql, [ idUserToVisit, myId ], (err) => {
												if (err) {
													reject(err);
												}
												resolve();
											});
										} else {
											sql =
												'INSERT INTO user_likes(id_user, id_user_like, matcha_like) VALUES(?, ?, ?)';

											connection.query(sql, [ idUserToVisit, myId, true ], (err) => {
												if (err) {
													reject(err);
												}
												resolve();
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

	static addDisconnectToDb(idUser) {
		return new Promise((resolve, reject) => {
			let sql = 'UPDATE users SET disconnect = NOW() ' + 'WHERE id = ?';

			connection.query(sql, idUser, (err) => {
				if (err) {
					reject(err);
				}
				resolve();
			});
		});
	}

	static getNotificationsInDb(id_user) {
		return new Promise((resolve, reject) => {
			let notifs = [],
				sql =
					'SELECT id_user_visit, login_user_visit, date_visit, photo_user_visit, action FROM user_notifications ' +
					'WHERE id_user = ? ORDER BY date_visit DESC';

			connection.query(sql, [ id_user ], (err, res) => {
				if (err) {
					reject(err);
				} else {
					if (res.length) {
						notifs = res;
					}
					resolve(notifs);
				}
			});
		});
	}

	static removeNotificationsInDb(id_user) {
		return new Promise((resolve, reject) => {
			let sql = 'DELETE FROM user_notifications WHERE id_user = ?';

			connection.query(sql, id_user, (err) => {
				if (err) {
					reject(err);
				} else {
					sql = 'UPDATE users SET notifications = 0 WHERE id = ?';

					connection.query(sql, id_user, (err) => {
						if (err) {
							reject(err);
						}
						resolve();
					});
				}
			});
		});
	}
}
module.exports = SocketModel;
