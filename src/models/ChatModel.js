class ChatModel {
	static getUsersForChat(idUser) {
		return new Promise((resolve, reject) => {
			// recupere les id des personnes que l'utilisateur courant a like ainsi que les infos necessaire a l'affichage dans le chat
			let sql = 'SELECT * FROM connect_users WHERE id_user1 = ?';

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
}
module.exports = ChatModel;
