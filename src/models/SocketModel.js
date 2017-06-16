class SocketModel {
	static addNewVisitToDb(myId, idUserToVisit) {
		return new Promise((resolve, reject) => {
			let sql = 'INSERT INTO user_visits(id_user, id_user_visit, date_visit) ' + 'VALUES(?, ?, NOW())';

			connection.query(sql, [ idUserToVisit, myId ], (err) => {
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
}
module.exports = SocketModel;
