class ChatModel {
	static getUsersForChat(idUser) {
		return new Promise((resolve, reject) => {
			let sql =
				'SELECT DISTINCT id_user_visit, login_user_visit, photo_user_visit FROM users_notifications WHERE likeUnlike = 1 && id_user = ?';

			connection.query(sql, [ idUser ], (err, res) => {
				if (err) {
					reject(err);
				}
				resolve(res);
			});
			// recupere id, login, photo profil dans la table users, usersPhotoProfil
			// recupere historique des messages
		});
	}
}
module.exports = ChatModel;
