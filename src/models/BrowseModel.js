/**
 * Created by jbmar on 31/05/2017.
 */

const geolib = require('geolib');

class BrowseModel {
	static getInfosAllProfils(idUserSession) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT id, login, orientation, bio, lat, lng, age, city, country FROM users WHERE id != ?';

			connection.query(sql, [ idUserSession ], (err, res) => {
				resolve(res);
				if (err) {
					reject(err);
				}
			});
		});
	}

	static getAllPhotosProfils(idUserSession) {
		return new Promise((resolve, reject) => {
			let sql =
				'SELECT id_user, src_photo, photo_profil FROM  users_photos_profils WHERE id_user != ? && photo_profil = 1';

			connection.query(sql, [ idUserSession ], (err, res) => {
				if (err) {
					reject(err);
				}
				let ret = res;

				sql = 'SELECT DISTINCT id_user, src_photo FROM users_photos_profils WHERE id != ?';

				connection.query(sql, idUserSession, (err, res) => {
					for (let i = 0; i < res.length; i++) {
						let check = false;

						for (let j = 0; j < ret.length; j++) {
							if (ret[j].id_user == res[i].id_user) {
								check = true;
							}
						}
						if (check == false) {
							ret.push(res[i]);
						}
					}
					resolve(ret);
				});
			});
		});
	}

	static getInfosUserSession(idUserSession) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT * FROM users WHERE id = ?';

			connection.query(sql, [ idUserSession ], (err, res) => {
				resolve(res);
				if (err) {
					reject(err);
				}
			});
		});
	}

	static updateDistanceFromUserAndtheOther(idUserSession, profils, infosUserSession) {
		return Promise.all(
			profils.map((profil) => {
				return BrowseModel.getDistanceFromAddress(idUserSession, infosUserSession, profil);
			})
		);
	}

	static getDistanceFromAddress(idUserSession, infosUserSession, profil) {
		return new Promise((resolve, reject) => {
			let distance = geolib.getDistanceSimple(
				{
					latitude: infosUserSession[0].lat,
					longitude: infosUserSession[0].lng
				},
				{
					latitude: profil.lat,
					longitude: profil.lng
				}
			);

			BrowseModel.sendDistanceFromUserSessionInDb(idUserSession, distance, profil.id)
				.then(() => {
					resolve();
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	static sendDistanceFromUserSessionInDb(idUserSession, distanceFromUser, idProfil) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT id FROM user_interacts WHERE id_user_session = ? && id_user = ?';

			connection.query(sql, [ idUserSession, idProfil ], (err, res) => {
				if (err) {
					reject(err);
				} else {
					if (res.length) {
						sql =
							'UPDATE user_interacts ' +
							'SET distanceFromUser = ?, 			distanceFromUserKm = ? WHERE id_user_session = ? && id_user = ?';

						connection.query(
							sql,
							[ distanceFromUser, Math.round(distanceFromUser / 1000), idUserSession, idProfil ],
							(err) => {
								if (err) {
									reject(err);
								} else {
									resolve();
								}
							}
						);
					} else {
						sql =
							'INSERT INTO user_interacts SET id_user_session = ?, distanceFromUser = ?, distanceFromUserKm = ?, id_user = ?';

						connection.query(
							sql,
							[ idUserSession, distanceFromUser, Math.round(distanceFromUser / 1000), idProfil ],
							(err) => {
								if (err) {
									reject(err);
								} else {
									resolve();
								}
							}
						);
					}
				}
			});
		});
	}

	static getCommunTagsByUsers(idUserSession) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT * FROM tags_user WHERE id_user != ?',
				AllTags = {
					tagsAllOtherUsers: [],
					tagsUserSession: []
				};

			connection.query(sql, [ idUserSession ], (err, res) => {
				if (err) {
					reject(err);
				} else {
					AllTags.tagsAllOtherUsers = res;
					sql = 'SELECT * FROM tags_user WHERE id_user = ?';

					connection.query(sql, [ idUserSession ], (err, res) => {
						if (err) {
							reject(err);
						} else {
							AllTags.tagsUserSession = res;
							BrowseModel.calculateCommunTagsByUsers(AllTags).then((tagsCommun) => {
								for (let i = 0; i < tagsCommun.length; i++) {
									BrowseModel.addCommunTagsToDb(
										tagsCommun[i].tagsCommun,
										tagsCommun[i].id,
										idUserSession
									);
								}
								resolve();
							});
						}
					});
				}
			});
		});
	}

	static addCommunTagsToDb(tag, idUser, idUserSession) {
		return new Promise((resolve, reject) => {
			let sql = 'UPDATE user_interacts SET tagsCommun = ? WHERE id_user = ? && id_user_session = ?';

			connection.query(sql, [ tag, idUser, idUserSession ], (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	static calculateCommunTagsByUsers(Alltags) {
		return new Promise((resolve, reject) => {
			let user = 0,
				countByUser = [];

			Alltags.tagsUserSession.map((tagUserSession) => {
				// Parcours chaques tag user Session
				let count = 0;

				Alltags.tagsAllOtherUsers.map((tagAllOtherUsers) => {
					if (user !== tagAllOtherUsers.id_user) {
						user = tagAllOtherUsers.id_user;
					}
					if (user === tagAllOtherUsers.id_user) {
						if (countByUser[user]) {
							count = countByUser[user];
						} else {
							count = 0;
						}
						if (tagAllOtherUsers.tag === tagUserSession.tag) {
							count++;
						}
					}
					countByUser[user] = count;
				});
			});
			let dataToSend = [],
				j = 0;

			for (let i = 0; i < countByUser.length; i++) {
				if (countByUser[i] && countByUser[i] > 0) {
					dataToSend[j] = {
						id: i,
						tagsCommun: countByUser[i]
					};
					j++;
				}
			}
			resolve(dataToSend);
		});
	}

	static filterProfilsOrderByDistance(
		idUserSession,
		infosUserSession,
		orderBy,
		option,
		minMax,
		zoneSize,
		trie,
		tagsArray
	) {
		return new Promise((resolve, reject) => {
			let sql =
					'SELECT DISTINCT * ' +
					'FROM users ' +
					'INNER JOIN user_interacts ' +
					'ON user_interacts.id_user = users.id ' +
					'WHERE users.id != ? && (locked != true) && ',
				orientation = infosUserSession[0].orientation,
				sex = infosUserSession[0].sex;
			if (orientation == 3 && sex == 1) {
				// Homme be => trouver homme gay ou be + femme hetero ou be
				sql +=
					'(sex = 1 && (orientation = 1 || orientation = 3) || sex = 2 && (orientation = 1 || orientation = 3)) ';
			} else if (orientation == 3 && sex == 2) {
				// Femme be => trouver homme hetero ou be + femme gay ou be
				sql +=
					'(sex = 1 && (orientation = 2 || orientation = 3) || sex = 2 && (orientation = 2 || orientation = 3)) ';
			} else if (orientation == 2 && sex == 1) {
				// Homme hetero => trouver femme hetero ou femme be
				sql += 'sex = 2 && ' + '(orientation = 1 || orientation = 3) ';
			} else if (orientation == 2 && sex == 2) {
				// femme gay => trouver femme gay ou be
				sql += 'sex = 2 && ' + '(orientation = 2 || orientation = 3) ';
			} else if (orientation == 1 && sex == 1) {
				// homme gay => trouver homme gay ou be
				sql += 'sex = 1 && ' + '(orientation = 1 || orientation = 3) ';
			} else if (orientation == 1 && sex == 2) {
				// femme hetero => trouver homme hetero ou be
				sql += 'sex = 1 && ' + '(orientation = 2 || orientation = 3) ';
			}

			if (minMax) {
				sql +=
					' && ' +
					minMax.distance +
					' >= ' +
					minMax.minDistance +
					' && ' +
					minMax.distance +
					' <= ' +
					minMax.maxDistance;
				sql += ' && ' + minMax.tags + ' >= ' + minMax.minTags + ' && ' + minMax.tags + ' <= ' + minMax.maxTags;
				sql += ' && ' + minMax.pop + ' >= ' + minMax.minPop + ' && ' + minMax.pop + ' <= ' + minMax.maxPop;
				sql += ' && ' + minMax.age + ' >= ' + minMax.minAge + ' && ' + minMax.age + ' <= ' + minMax.maxAge;
			}

			sql += ' ORDER BY distanceFromUser ' + orderBy;
			connection.query(sql, [ idUserSession, idUserSession ], (err, res) => {
				let result1stQuery = res;
				if (err) {
					reject(err);
				} else {
					if (!option) {
						option = 'zone';
					}
					res = BrowseModel.removeDuplicateRow(res);
					let resultAfterRemoveDuplicateRow = res;

					sql = 'UPDATE users SET nbUsersMatch = ? WHERE id = ?';
					connection.query(sql, [ res.length, idUserSession ], (err) => {
						if (err) {
							reject(err);
						}
						BrowseModel.engineFilterUsers(
							res,
							option,
							zoneSize,
							orderBy,
							trie,
							tagsArray,
							infosUserSession,
							idUserSession
						).then((newTabUsers) => {
							resolve(newTabUsers);
						});
					});
				}
			});
		});
	}

	static removeDuplicateRow(data) {
		let i = 0;

		while (i < data.length) {
			if (data[i].id != data[i].id_user) {
				debugger;
				data[i].id = data[i].id_user;
			}
			i++;
		}
		for (let i = 0; i < data.length; i++) {
			for (let j = i + 1; j < data.length; j++) {
				if (j < data.length) {
					if (data[j].id === data[i].id) {
						data.splice(j, 1);
					}
				}
			}
		}
		return data;
	}

	static engineFilterUsers(data, filterType, zoneSize, orderBy, trie, tagsArray, infosUserSession, idUserSession) {
		// filterType can be "zone", "tags", "popularity"
		return new Promise((resolve) => {
			let newTabUsers = [],
				maxZone = 100000000;

			if (!zoneSize) {
				zoneSize = 50000;
			}

			if (orderBy !== 'ASC' && orderBy !== 'DESC') {
				orderBy = 'ASC';
			}
			if (filterType === 'zone') {
				while (newTabUsers.length < 1 && zoneSize < maxZone) {
					// Filtre la data par distance
					newTabUsers = BrowseModel.filterEngineByZone(data, zoneSize, orderBy);
					//Filtre la data par tags Commun
					if (!trie) {
						newTabUsers = BrowseModel.filterEngineByTags(newTabUsers, zoneSize);
						//Filtre par popularite
						newTabUsers = BrowseModel.filterEngineByPop(newTabUsers, zoneSize);
					}
					zoneSize += zoneSize;
				}
				if (newTabUsers.length < 1) {
					newTabUsers = BrowseModel.filterEngineByTags(data, 'noUsersWithZoneSize');
					newTabUsers = BrowseModel.filterEngineByPop(newTabUsers, 'noUsersWithZoneSize');
					if (tagsArray) {
						BrowseModel.filterBySelectedTags(newTabUsers, tagsArray, infosUserSession, idUserSession)
							.then((users) => {
								newTabUsers = users;
								resolve(newTabUsers);
							})
							.catch((err) => {
								console.error(err);
							});
					}
				}
			}

			if (filterType === 'TAGS') {
				while (newTabUsers.length < 1 && zoneSize < maxZone) {
					// Filtre la data par distance
					newTabUsers = BrowseModel.filterEngineByZone(data, zoneSize, orderBy);
					//Filtre la data par tags Commun
					if (!trie) {
						newTabUsers = BrowseModel.filterEngineByTags(newTabUsers, zoneSize);
					} else {
						newTabUsers = BrowseModel.filterEngineByTags(newTabUsers, zoneSize, 'tags');
					}
					zoneSize += zoneSize;
				}
				if (newTabUsers.length < 1) {
					newTabUsers = BrowseModel.filterEngineByTags(data, 'noUsersWithZoneSize', 'tags');
				}
			}

			if (filterType === 'POP') {
				while (newTabUsers.length < 1 && zoneSize < maxZone) {
					// Filtre la data par distance
					newTabUsers = BrowseModel.filterEngineByZone(data, zoneSize, orderBy);
					//Filtre par popularite
					if (!trie) {
						newTabUsers = BrowseModel.filterEngineByPop(newTabUsers, zoneSize);
					} else {
						newTabUsers = BrowseModel.filterEngineByPop(newTabUsers, zoneSize, 'pop');
					}
					zoneSize += zoneSize;
				}
				if (newTabUsers.length < 1) {
					newTabUsers = BrowseModel.filterEngineByPop(data, 'noUsersWithZoneSize', 'pop');
				}
			}
			if (filterType === 'AgeASC') {
				while (newTabUsers.length < 1 && zoneSize < maxZone) {
					// Filtre la data par distance
					newTabUsers = BrowseModel.filterEngineByZone(data, zoneSize, orderBy);
					//Filtre par popularite
					newTabUsers = BrowseModel.filterEngineByAge(newTabUsers, zoneSize, 'ageASC');
					zoneSize += zoneSize;
				}
				if (newTabUsers.length < 1) {
					newTabUsers = BrowseModel.filterEngineByAge(data, 'noUsersWithZoneSize', 'ageASC');
				}
			}
			if (filterType === 'AgeDESC') {
				while (newTabUsers.length < 1 && zoneSize < maxZone) {
					// Filtre la data par distance
					newTabUsers = BrowseModel.filterEngineByZone(data, zoneSize, orderBy);
					//Filtre par popularite
					newTabUsers = BrowseModel.filterEngineByAge(newTabUsers, zoneSize, 'ageDESC');
					zoneSize += zoneSize;
				}
				if (newTabUsers.length < 1) {
					newTabUsers = BrowseModel.filterEngineByAge(data, 'noUsersWithZoneSize', 'ageDESC');
				}
			}
			if (!tagsArray) {
				resolve(newTabUsers);
			}
		});
	}

	static filterBySelectedTags(newTabUsers, tagsArray, infosUserSession, idUserSession, option) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT id_user FROM tags_user WHERE tag IN (';

			for (let i = 0; i < tagsArray.length; i++) {
				sql += '"' + tagsArray[i] + '"';
				if (i + 1 < tagsArray.length) {
					sql += ', ';
				} else {
					sql += ') GROUP BY id_user HAVING COUNT(*) = ?';
				}
			}
			connection.query(sql, [ tagsArray.length ], (err, res) => {
				if (err) {
					reject(err);
				}
				if (res.length) {
					let retTab = [],
						i = 0;

					newTabUsers.map((user) => {
						res.map((id_user) => {
							if (id_user.id_user == user.id_user) {
								let check = true;

								retTab.map((retUser) => {
									if (retUser.id_user == id_user.id_user) {
										check = false;
									}
								});
								if (check === true) {
									retTab[i] = user;
									i++;
								}
							}
						});
					});
					retTab.map((user) => {
						user.id = user.id_user;
					});
					// retTab = BrowseModel.removeDuplicateRow(retTab);
					resolve(retTab);
				} else {
					resolve(false);
				}
			});
		});
	}

	static filterEngineByZone(data, zoneSize, orderBy) {
		let newTabUsers = [];

		if (zoneSize !== 'noUsersWithZoneSize') {
			for (let i = 0; i < data.length; i++) {
				if (data[i].distanceFromUser <= zoneSize) {
					newTabUsers.push(data[i]);
				}
			}
		} else {
			newTabUsers = data;
		}

		if (orderBy === 'ASC') {
			for (let i = 0; i < newTabUsers.length; i++) {
				let tmp = newTabUsers[i].distanceFromUser;

				if (i + 1 < newTabUsers.length) {
					if (newTabUsers[i + 1].distanceFromUser < newTabUsers[i].distanceFromUser) {
						newTabUsers[i].distanceFromUser = newTabUsers[i + 1].distanceFromUser;
						newTabUsers[i + 1].distanceFromUser = tmp;
						i = 0;
					}
				}
			}
		}

		if (orderBy === 'DESC') {
			for (let i = 0; i < newTabUsers.length; i++) {
				let tmp = newTabUsers[i].distanceFromUser;

				if (i + 1 < newTabUsers.length) {
					if (newTabUsers[i + 1].distanceFromUser > newTabUsers[i].distanceFromUser) {
						newTabUsers[i].distanceFromUser = newTabUsers[i + 1].distanceFromUser;
						newTabUsers[i + 1].distanceFromUser = tmp;
						i = 0;
					}
				}
			}
		}
		return newTabUsers;
	}

	static filterEngineByTags(data, zoneSize, option) {
		for (let i = 0; i < data.length; i++) {
			let tmp = data[i];

			if (i > 0) {
				if (!option) {
					if (zoneSize !== 'noUsersWithZoneSize') {
						if (
							data[i - 1].tagsCommun < data[i].tagsCommun &&
							data[i].distanceFromUser - data[i - 1].distanceFromUser <= zoneSize
						) {
							data[i] = data[i - 1];
							data[i - 1] = tmp;
							i = 0;
						}
					} else {
						if (data[i - 1].tagsCommun < data[i].tagsCommun && data[i].city === data[i - 1].city) {
							data[i] = data[i - 1];
							data[i - 1] = tmp;
							i = 0;
						}
					}
				} else if (option === 'tags') {
					if (data[i - 1].tagsCommun < data[i].tagsCommun) {
						data[i] = data[i - 1];
						data[i - 1] = tmp;
						i = 0;
					}
				}
			}
		}
		return data;
	}

	static filterEngineByPop(data, zoneSize, option) {
		for (let i = 0; i < data.length; i++) {
			let tmp = data[i];

			if (i > 0) {
				if (!option) {
					if (zoneSize !== 'noUsersWithZoneSize') {
						if (
							data[i - 1].popularity < data[i].popularity &&
							data[i].distanceFromUser - data[i - 1].distanceFromUser <= zoneSize &&
							data[i - 1].tagsCommun == data[i].tagsCommun
						) {
							data[i] = data[i - 1];
							data[i - 1] = tmp;
							i = 0;
						}
					} else {
						if (
							data[i - 1].tagsCommun < data[i].tagsCommun &&
							data[i].city === data[i - 1].city &&
							data[i - 1].tagsCommun == data[i].tagsCommun
						) {
							data[i] = data[i - 1];
							data[i - 1] = tmp;
							i = 0;
						}
					}
				} else if (option === 'pop') {
					if (data[i - 1].popularity < data[i].popularity) {
						data[i] = data[i - 1];
						data[i - 1] = tmp;
						i = 0;
					}
				}
			}
		}
		return data;
	}

	static filterEngineByAge(data, zoneSize, option) {
		for (let i = 0; i < data.length; i++) {
			let tmp = data[i];
			if (i > 0) {
				if (zoneSize !== 'noUsersWithZoneSize') {
					if (option === 'ageASC') {
						if (
							data[i - 1].age > data[i].age &&
							data[i].distanceFromUser - data[i - 1].distanceFromUser <= zoneSize
						) {
							data[i] = data[i - 1];
							data[i - 1] = tmp;
							i = 0;
						} else if (
							data[i - 1].age == data[i].age &&
							data[i].distanceFromUser - data[i - 1].distanceFromUser <= zoneSize &&
							(data[i].tagsCommun > data[i - 1].tagsCommun ||
								(data[i].tagsCommun == data[i - 1].tagsCommun &&
									data[i].popularity > data[i - 1].popularity))
						) {
							data[i] = data[i - 1];
							data[i - 1] = tmp;
							i = 0;
						}
					} else if (option === 'ageDESC') {
						if (
							data[i - 1].age < data[i].age &&
							data[i].distanceFromUser - data[i - 1].distanceFromUser <= zoneSize
						) {
							data[i] = data[i - 1];
							data[i - 1] = tmp;
							i = 0;
						} else if (
							data[i - 1].age == data[i].age &&
							data[i].distanceFromUser - data[i - 1].distanceFromUser <= zoneSize &&
							(data[i].tagsCommun > data[i - 1].tagsCommun ||
								(data[i].tagsCommun == data[i - 1].tagsCommun &&
									data[i].popularity > data[i - 1].popularity))
						) {
							data[i] = data[i - 1];
							data[i - 1] = tmp;
							i = 0;
						}
					}
				} else {
					if (option === 'ageASC') {
						if (data[i - 1].age > data[i].age) {
							data[i] = data[i - 1];
							data[i - 1] = tmp;
							i = 0;
						} else if (
							data[i - 1].age == data[i].age &&
							data[i].city === data[i - 1].city &&
							(data[i - 1].tagsCommun < data[i].tagsCommun ||
								(data[i].tagsCommun == data[i - 1].tagsCommun &&
									data[i].popularity > data[i - 1].popularity))
						) {
							data[i] = data[i - 1];
							data[i - 1] = tmp;
							i = 0;
						}
					} else if (option === 'ageDESC') {
						if (data[i - 1].age < data[i].age) {
							data[i] = data[i - 1];
							data[i - 1] = tmp;
							i = 0;
						} else if (
							data[i - 1].age == data[i].age &&
							data[i].city === data[i - 1].city &&
							(data[i - 1].tagsCommun < data[i].tagsCommun ||
								(data[i].tagsCommun == data[i - 1].tagsCommun &&
									data[i].popularity > data[i - 1].popularity))
						) {
							data[i] = data[i - 1];
							data[i - 1] = tmp;
							i = 0;
						}
					}
				}
			}
		}
		return data;
	}

	static getMinMaxValForSlidersIntervals(users) {
		let minMax = {};

		users.map((user, index) => {
			if (index > 0) {
				if (user.age < minMax.minAge) {
					minMax.minAge = user.age;
				}
				if (user.age > minMax.maxAge) {
					minMax.maxAge = user.age;
				}
				if (user.popularity < minMax.minPop) {
					minMax.minPop = user.popularity;
				}
				if (user.popularity > minMax.maxPop) {
					minMax.maxPop = user.popularity;
				}
				if (user.distanceFromUser < minMax.minDistance) {
					minMax.minDistance = user.distanceFromUser;
					minMax.minDistanceKm = user.distanceFromUserKm;
				}
				if (user.distanceFromUser > minMax.maxDistance) {
					minMax.maxDistance = user.distanceFromUser;
					minMax.maxDistanceKm = user.distanceFromUserKm;
				}
				if (user.tagsCommun < minMax.minTags) {
					minMax.minTags = user.tagsCommun;
				}
				if (user.tagsCommun > minMax.maxTags) {
					minMax.maxTags = user.tagsCommun;
				}
			} else {
				minMax = {
					minAge: user.age,
					maxAge: user.age,
					minPop: user.popularity,
					maxPop: user.popularity,
					minDistance: user.distanceFromUser,
					maxDistance: user.distanceFromUser,
					minDistanceKm: user.distanceFromUserKm,
					maxDistanceKm: user.distanceFromUserKm,
					minTags: user.tagsCommun,
					maxTags: user.tagsCommun
				};
			}
		});
		return minMax;
	}

	static getAllPhotoUser(idUser) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT src_photo FROM users_photos_profils WHERE id_user = ?';

			connection.query(sql, [ idUser ], (err, res) => {
				if (err) {
					reject(err);
				}
				resolve(res);
			});
		});
	}

	static getAllTagsUser(idUser) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT tag FROM tags_user WHERE id_user = ?';

			connection.query(sql, [ idUser ], (err, res) => {
				if (err) {
					reject(err);
				}
				resolve(res);
			});
		});
	}

	static getIfLikeUser(userId, myId) {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT matcha_like FROM user_likes WHERE id_user = ? && id_user_like = ?';

			connection.query(sql, [ userId, myId ], (err, res) => {
				if (err) {
					reject(err);
				}
				if (res.length) {
					resolve(true);
				} else {
					resolve(false);
				}
			});
		});
	}

	static setUserReportLockInDb(idUser, idUserTolock, action) {
		return new Promise((resolve, reject) => {
			let sql = 'INSERT INTO report_lock(id_user, id_user_lock, action) VALUES(?, ?, ?)';

			connection.query(sql, [ idUser, idUserTolock, action ], (err) => {
				if (err) {
					reject(err);
				} else {
					sql = 'UPDATE user_interacts SET locked = ? WHERE id_user_session = ? && id_user = ?';

					connection.query(sql, [ true, idUser, idUserTolock ], (err) => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
				}
			});
		});
	}

	static setPopToDb(myId, idUserVisit) {
		// Insert l'utilisateur en cours comme ayant vu le profil
		// Incremente le nb de vue pour ce profil
		// Recupere le nb total d'utilisateurs qui match avec ce profil
		// Insert dans le db le score nb-total-users / nb-de-vus

		return new Promise((resolve, reject) => {
			let sql = 'SELECT id FROM user_interacts WHERE id_user_session = ? && id_user = ? && vue = ?';

			connection.query(sql, [ myId, idUserVisit, 0 ], (err, res) => {
				if (err) {
					reject(err);
				} else {
					if (res.length) {
						sql = 'UPDATE user_interacts SET vue = true WHERE id_user_session = ? && id_user = ?';

						connection.query(sql, [ myId, idUserVisit ], (err) => {
							if (err) {
								reject(err);
							} else {
								sql = 'UPDATE users SET vues = vues + 1 WHERE id = ?';

								connection.query(sql, idUserVisit, (err) => {
									if (err) {
										reject(err);
									} else {
										sql = 'SELECT vues FROM users WHERE id = ?';

										connection.query(sql, [ idUserVisit ], (err, res) => {
											if (err) {
												reject(err);
											} else {
												let vues = res[0].vues;

												sql = 'SELECT nbUsersMatch FROM users WHERE id = ?';
												connection.query(sql, [ myId ], (err, res) => {
													if (err) {
														reject(err);
													} else {
														let total = res[0].nbUsersMatch,
															pop = vues / total * 100;

														sql = 'UPDATE users SET popularity = ? WHERE id = ?';
														connection.query(sql, [ pop, idUserVisit ], (err) => {
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
					resolve();
				}
			});
		});
	}
}
module.exports = BrowseModel;
