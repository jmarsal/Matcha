class SocketModel {
	static addNewVisitToDb(myId, myLogin, idUserToVisit) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT src_photo FROM users_photos_profils WHERE id_user = ? && photo_profil = 1',
				photoProfilSrc = '/images/upload/default-user.png';

			connection.query(sql, myId, (err, res) => {
				if (err) {
					reject(err);
				} else {
					if (res[0] && (res[0].src_photo !== photoProfilSrc || res[0].src_photo !== '')) {
						photoProfilSrc = res[0].src_photo;
					}
					sql = 'SELECT id FROM report_lock WHERE id_user = ? && id_user_lock = ?';

					connection.query(sql, [ idUserToVisit, myId ], (err, res) => {
						if (err) {
							reject(err);
						} else {
							if (!res.length) {
								sql =
									'INSERT INTO user_notifications(photo_user_visit, id_user, login_user_visit, id_user_visit, date_visit, action) VALUES(?, ?, ?, ?, NOW(), ?)';
								connection.query(
									sql,
									[ photoProfilSrc, idUserToVisit, myLogin, myId, 'visit' ],
									(err) => {
										if (err) {
											reject(err);
										} else {
											sql = 'UPDATE users SET notifications = notifications + 1 WHERE id = ?';

											connection.query(sql, [ idUserToVisit ], (err) => {
												if (err) {
													reject(err);
												} else {
													sql = 'SELECT notifications FROM users WHERE id = ?';

													connection.query(sql, idUserToVisit, (err, res) => {
														if (err) {
															reject(err);
														}
														resolve(res[0].notifications);
													});
												}
											});
										}
									}
								);
							} else {
								resolve(false);
							}
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
					if (!res.length) {
						resolve({ error: "Tu a besoin d'une photo de profil afin de pouvoir liker un utilisateur !" });
					} else if (res[0] && (res[0].src_photo !== photoProfilSrc || res[0].src_photo !== '')) {
						photoProfilSrc = res[0].src_photo;

						sql = 'SELECT id FROM report_lock WHERE id_user = ? && id_user_lock = ?';

						connection.query(sql, [ idUserToVisit, myId ], (err, res) => {
							if (err) {
								reject(err);
							} else {
								if (!res.length) {
									sql =
										'INSERT INTO user_notifications(photo_user_visit, id_user, login_user_visit, id_user_visit, date_visit, action) VALUES(?, ?, ?, ?, NOW(), ?)';
									connection.query(
										sql,
										[ photoProfilSrc, idUserToVisit, myLogin, myId, 'like' ],
										(err) => {
											if (err) {
												reject(err);
											} else {
												sql = 'UPDATE users SET notifications = notifications + 1 WHERE id = ?';

												connection.query(sql, [ idUserToVisit ], (err) => {
													if (err) {
														reject(err);
													} else {
														sql =
															'SELECT matcha_like FROM user_likes WHERE id_user_like = ? && id_user = ?';

														connection.query(sql, [ myId, idUserToVisit ], (err, res) => {
															if (err) {
																reject(err);
															}
															if (res.length) {
																sql =
																	'DELETE FROM user_likes WHERE id_user = ? && id_user_like = ?';

																connection.query(
																	sql,
																	[ idUserToVisit, myId ],
																	(err) => {
																		if (err) {
																			reject(err);
																		} else {
																			let res = false;
																			sql =
																				'UPDATE user_notifications SET likeUnlike = ? WHERE id_user = ? && id_user_visit = ? ORDER BY id DESC LIMIT 1';

																			connection.query(
																				sql,
																				[ res, idUserToVisit, myId ],
																				(err) => {
																					if (err) {
																						reject(err);
																					} else {
																						sql =
																							'SELECT notifications FROM users WHERE id = ?';

																						connection.query(
																							sql,
																							idUserToVisit,
																							(err, res) => {
																								if (err) {
																									reject(err);
																								}
																								resolve({
																									nbNotifs:
																										res[0]
																											.notifications,
																									status: false
																								});
																							}
																						);
																					}
																				}
																			);
																		}
																	}
																);
															} else {
																sql =
																	'INSERT INTO user_likes(id_user, id_user_like, matcha_like) VALUES(?, ?, ?)';

																connection.query(
																	sql,
																	[ idUserToVisit, myId, true ],
																	(err) => {
																		if (err) {
																			reject(err);
																		} else {
																			sql =
																				'SELECT notifications FROM users WHERE id = ?';

																			connection.query(
																				sql,
																				idUserToVisit,
																				(err, res) => {
																					if (err) {
																						reject(err);
																					}
																					resolve({
																						nbNotifs: res[0].notifications,
																						status: true
																					});
																				}
																			);
																		}
																	}
																);
															}
														});
													}
												});
											}
										}
									);
								} else {
									sql = 'SELECT matcha_like FROM user_likes WHERE id_user = ? && id_user_like = ?';

									connection.query(sql, [ idUserToVisit, myId ], (err, res) => {
										if (err) {
											reject(err);
										} else {
											if (res.length) {
												let match = res[0].matcha_like;
												if (match) {
													sql =
														'UPDATE user_likes SET matcha_like = ? WHERE id_user = ? && id_user_like = ?';

													connection.query(sql, [ false, idUserToVisit, myId ], (err) => {
														if (err) {
															reject(err);
														}
														resolve(false);
													});
												} else {
													sql =
														'UPDATE user_likes SET matcha_like = ? WHERE id_user = ? && id_user_like = ?';

													connection.query(sql, [ true, idUserToVisit, myId ], (err) => {
														if (err) {
															reject(err);
														}
														resolve(true);
													});
												}
											} else {
												sql =
													'INSERT INTO user_likes(id_user, id_user_like, matcha_like) VALUES(?, ?, ?)';

												connection.query(sql, [ idUserToVisit, myId, true ], (err) => {
													if (err) {
														reject(err);
													} else {
														resolve(true);
													}
												});
											}
										}
									});
								}
							}
						});
					}
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
					'SELECT id_user_visit, login_user_visit, date_visit, photo_user_visit, action, likeUnlike FROM user_notifications ' +
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

	static getDateOfLastConnectedUser(idUserProfil) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT disconnect FROM users WHERE id = ?';

			connection.query(sql, idUserProfil, (err, res) => {
				if (err) {
					reject(err);
				}
				resolve(res[0].disconnect.toLocaleString('fr-FR', { hour12: false }));
			});
		});
	}
}
module.exports = SocketModel;
