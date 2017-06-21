class ChatModel {
	static getUsersForChat(idUser) {
		return new Promise((resolve, reject) => {
			// recupere les id des personnes que l'utilisateur courant a like
			let sql = 'SELECT id_user_like FROM user_like WHERE matcha_like = 1 && id_user = ?';

			connection.query(sql, [ idUser ], (err, res) => {
				if (err) {
					reject(err);
				} else {
					let likesOfUserSession = res;
					// connection.query;
				}
				resolve(res);
			});
			// recupere id, login, photo profil dans la table users, usersPhotoProfil
			// recupere historique des messages
		});
	}
}
module.exports = ChatModel;
