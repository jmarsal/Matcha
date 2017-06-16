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
						'INSERT INTO user_visits(photo_user_visit, id_user, login_user_visit, id_user_visit, date_visit) VALUES(?, ?, ?, ?, NOW())';
					connection.query(sql, [ photoProfilSrc, idUserToVisit, myLogin, myId ], (err) => {
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

	static getNotificationsInDb(id_user) {
		return new Promise((resolve, reject) => {
			let notifs = {},
				sql =
					'SELECT login_user_visit, date_visit, photo_user_visit FROM user_visits ' +
					'WHERE id_user = ? ORDER BY date_visit DESC';

			connection.query(sql, [ id_user ], (err, res) => {
				if (err) {
					reject(err);
				} else {
					if (res.length) {
						console.log(res.length);
						notifs.visits = res;
					}
					sql =
						'SELECT login_user_like, date_visit, photo_user_like FROM user_likes ' +
						'WHERE id_user = ? ORDER BY date_visit DESC';

					connection.query(sql, [ id_user ], (err, res) => {
						if (err) {
							reject(err);
						} else {
							if (res.length) {
								console.log(res.length);
								notifs.likes = res;
							}
							resolve(notifs);
						}
					});
				}
			});
		});
	}
}
module.exports = SocketModel;
