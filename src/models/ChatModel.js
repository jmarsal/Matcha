class ChatModel {
	static getUsersForChat(idUser) {
		return new Promise((resolve, reject) => {
			// recupere les id des personnes que l'utilisateur courant a like ainsi que les infos necessaire a l'affichage dans le chat
			const sql = 'SELECT * FROM connect_users WHERE id_user1 = ?';

			connection.query(sql, [ idUser ], (err, res) => {
				if (err) {
					reject(err);
				} else {
					// Il y a bien des personnes qui like l'user en retour
					if (res.length) {
						resolve(res);
					} else {
						resolve(false);
					}
				}
			});
		});
	}

	static getHistoryMessage(idUser1) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT * FROM chat_history WHERE id_user1 = ? || id_user2 = ? ORDER BY date ASC';

			connection.query(sql, [ idUser1, idUser1 ], (err, res) => {
				if (err) {
					reject(err);
				}
				resolve(res);
			});
		});
	}

	static getHistoryForUserDefault(allHistory, idOtherUser) {
		return new Promise((resolve, reject) => {
			let messages = [];

			allHistory.map((message) => {
				if (message.id_user1 == idOtherUser || message.id_user2 == idOtherUser) {
					messages.push(message);
				}
			});
			debugger;
			resolve(messages);
		});
	}
}
module.exports = ChatModel;
