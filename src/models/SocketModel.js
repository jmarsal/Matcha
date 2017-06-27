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
			// check si l'user a une photo de profil avant de pouvoir like
			let sql = 'SELECT src_photo FROM users_photos_profils WHERE id_user = ? && photo_profil = 1',
				photoProfilSrc = '/images/upload/default-user.png';

			connection.query(sql, myId, (err, res) => {
				if (err) {
					reject(err);
				} else {
					// Si non return error
					if (!res.length) {
						resolve({ error: "Tu a besoin d'une photo de profil afin de pouvoir liker un utilisateur !" });
					} else if (res[0] && (res[0].src_photo !== photoProfilSrc || res[0].src_photo !== '')) {
						photoProfilSrc = res[0].src_photo;

						// Si oui, check si l'user qu'il visite ne l'a pas lock
						sql = 'SELECT id FROM report_lock WHERE id_user = ? && id_user_lock = ?';
						connection.query(sql, [ idUserToVisit, myId ], (err, res) => {
							if (err) {
								reject(err);
							} else {
								// Si pas lock
								if (!res.length) {
									// insert dans l'historique le nouveau like
									sql = 'INSERT INTO user_notifications(photo_user_visit, id_user, login_user_visit, id_user_visit, date_visit, action) VALUES(?, ?, ?, ?, NOW(), ?)';
									connection.query(sql, [ photoProfilSrc, idUserToVisit, myLogin, myId, 'like' ], (err) => {
										if (err) {
											reject(err);
										} else {
											// ajoute au compteur de notifications du champs user le nouveau like
											sql = 'UPDATE users SET notifications = notifications + 1 WHERE id = ?';

											connection.query(sql, [ idUserToVisit ], (err) => {
												if (err) {
													reject(err);
												} else {
													// regarde dans le champs user_likes si l'utilisateur like deja ou non
													sql = 'SELECT matcha_like FROM user_likes WHERE id_user_like = ? && id_user = ?';
													connection.query(sql, [ myId, idUserToVisit ], (err, res) => {
														if (err) {
															reject(err);
														}
														if (res.length) {
															// Si existe, donc like, le supprime pour unlike
															sql = 'DELETE FROM user_likes WHERE id_user = ? && id_user_like = ?';
															connection.query(sql, [ idUserToVisit, myId ], (err) => {
																if (err) {
																	reject(err);
																} else {
																	let res = false;
																	// ajoute a l'historique que l'utilisateur ne like plus la personne visité
																	sql = 'UPDATE user_notifications SET likeUnlike = ? WHERE id_user = ? && id_user_visit = ? ORDER BY id DESC LIMIT 1';
																	connection.query(sql, [ res, idUserToVisit, myId ], (err) => {
																		if (err) {
																			reject(err);
																		} else {
																			// Supprime la connection des deux users si existante
																			sql = "SELECT id FROM connect_users WHERE id_user1 = ? && id_user2 = ?"
																			connection.query(sql, [myId, idUserToVisit], (err, res) => {
																				if (res) {
																					sql = "DELETE FROM connect_users WHERE id_user1 = ? && id_user2 = ?"
																					connection.query(sql, [myId, idUserToVisit], (err) => {
																						if (err) { reject(err); }
																						connection.query(sql, [idUserToVisit, myId], (err) => {
																							if (err) { reject(err); }
																							// recupere le nb de notifications a afficher a chez la personne visité
																							sql = 'SELECT notifications FROM users WHERE id = ?';
																							connection.query(sql, idUserToVisit, (err, res) => {
																								if (err) {
																									reject(err);
																								}
																								resolve({
																									nbNotifs: res[0].notifications,
																									status: false,
																									connected: false
																								});
																							});
																						});
																					});
																				} else {
																					sql = 'SELECT notifications FROM users WHERE id = ?';
																					connection.query(sql, idUserToVisit, (err, res) => {
																						if (err) {
																							reject(err);
																						}
																						resolve({
																							nbNotifs: res[0].notifications,
																							status: false,
																							connected: false
																						});
																					});
																				}
																			});
																		}
																	});
																}
															});
														} else {
															// si unlike, l'ajoute pour garder le like dans l'historique
															sql = 'INSERT INTO user_likes(id_user, id_user_like, matcha_like) VALUES(?, ?, ?)';
															connection.query(sql, [ idUserToVisit, myId, true ], (err) => {
																if (err) {
																	reject(err);
																} else {
																	// check si l'utilisateur visite le like deja
																	sql = "SELECT id FROM user_likes WHERE id_user = ? && id_user_like = ?"
																	connection.query(sql, [myId, idUserToVisit], (err, res) => {
																		if (err) { reject(err); }
																		if (res.length) {
																			// Si oui inscrit les deux users comme connecté dans la table connect_user
																			sql = "SELECT login FROM users WHERE id = ?";
																			connection.query(sql, idUserToVisit, (err, res) => {
																				if (err) { reject(err); }
																				let loginUserVisit = res[0].login;

																				sql = "SELECT src_photo FROM users_photos_profils WHERE id_user = ? && photo_profil = 1";
																				connection.query(sql, [myId], (err, res) => {
																					if (err) { reject(err); }
																					let myPhoto = null;
																					if (res.length) {
																						myPhoto = res[0].src_photo;
																					}
																					connection.query(sql, [idUserToVisit], (err, res) => {
																						if (err) { reject(err); }
																						let photoUserVisit = null;
																						if (res.length) {
																							photoUserVisit = res[0].src_photo;
																						}
																						sql = "INSERT INTO connect_users(id_user1, login_user1, photo_user1, id_user2, login_user2, photo_user2) VALUES(?, ?, ?, ?, ?, ?)";

																						connection.query(sql, [myId, myLogin, myPhoto, idUserToVisit, loginUserVisit, photoUserVisit], (err) => {
																							if (err) { reject(err); }
																							connection.query(sql, [idUserToVisit, loginUserVisit, photoUserVisit, myId, myLogin, myPhoto], (err) => {
																								if (err) { reject(err); }
																								sql = 'SELECT notifications FROM users WHERE id = ?';

																								connection.query(sql, idUserToVisit, (err, res) => {
																									if (err) {
																										reject(err);
																									}
																									resolve({
																										nbNotifs: res[0].notifications,
																										status: true,
																										connected: true
																									});
																								});	
																							});																					
																						});
																					});
																				});
																			});
																		} else {
																			// recupere le nb de notifications a afficher chez la personne visité
																			sql = 'SELECT notifications FROM users WHERE id = ?';		
																			connection.query(sql, idUserToVisit, (err, res) => {
																				if (err) {
																					reject(err);
																				}
																				resolve({
																					nbNotifs: res[0].notifications,
																					status: true
																				});
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
								// action pour l'user mais qui n'interagis pas avec l'utilsateur visité car compte lock
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
					sql = 'UPDATE users SET notifications = 0 WHERE id = ?';

					connection.query(sql, id_user, (err) => {
						if (err) {
							reject(err);
						}
						resolve(notifs);
					});
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
				}
				resolve();
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

	static saveMessageOnDb(id_user1, id_user2, message, from) {
		return new Promise((resolve, reject) => {
			const sql = "INSERT INTO chat_history(id_user1, id_user2, message, from_user, date) VALUES(?, ?, ?, ?, NOW())"

			connection.query(sql, [id_user1, id_user2, message, from], (err) => {
				if (err) { reject(err); }
				resolve();
			})
		});
	}

	static addNewNotifForMess(myId, myLogin, idUserMess) {
		return new Promise((resolve, reject) => {
			// recupere photo user
			let sql = 'SELECT src_photo FROM users_photos_profils WHERE id_user = ? && photo_profil = 1',
				photoProfilSrc = '/images/upload/default-user.png';

			connection.query(sql, myId, (err, res) => {
				if (err) {
					reject(err);
				} else {
					if (res[0] && (res[0].src_photo !== photoProfilSrc || res[0].src_photo !== '')) {
						photoProfilSrc = res[0].src_photo;
					}
					sql = 'INSERT INTO user_notifications(photo_user_visit, id_user, login_user_visit, id_user_visit, date_visit, action) VALUES(?, ?, ?, ?, NOW(), ?)';
					connection.query(sql, [ photoProfilSrc, idUserMess, myLogin, myId, 'message' ], (err) => {
						if (err) {
							reject(err);
						} else {
							// ajoute au compteur de notifications du champs user le nouveau like
							sql = 'UPDATE users SET notifications = notifications + 1 WHERE id = ?';

							connection.query(sql, [ idUserMess ], (err) => {
								if (err) {
									reject(err);
								} else {
									sql = 'SELECT notifications FROM users WHERE id = ?';		
									connection.query(sql, idUserMess, (err, res) => {
										if (err) {
											reject(err);
										}
										resolve({
											nbNotifs: res[0].notifications,
											status: true
										});
									});
								}
							});
						}
					});
				}
			});
		});
	}
}
module.exports = SocketModel;
