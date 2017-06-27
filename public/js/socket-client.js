const socketClient = {
	webSocket: null,
	init: () => {
		this.webSocket = io.connect('http://localhost:3000');
		$('#error').removeClass('red').text('');

		this.webSocket.on('message', (message) => {
			let index = parseInt($('#nbMess')[0].className),
				classTmp = $('#nbMess')[0].className,
				idUserSelect = parseInt($('#chatUser')[0].className);

			if (!index) {
				index = 0;
			}
			$('<div/>', {
				class: 'container-message',
				id: 'cont' + index,
				appendTo: $('#container-chat' + idUserSelect)
			});
			$('<div/>', {
				class: 'talk-bubble tri-right round right-in me',
				id: 'mess' + index,
				appendTo: $('#cont' + index)
			});
			$('<div/>', {
				class: 'talktext',
				appendTo: $('#mess' + index)
			}).text(message);

			$('#container-chat' + idUserSelect).animate(
				{ scrollTop: $('#container-chat' + idUserSelect)[0].scrollHeight },
				1000
			);

			$('#nbMess').removeClass(classTmp).addClass((index + 1).toString());
			$('#input-chat').val('');
		});

		this.webSocket.on('messageOtherUser', (data) => {
			let index = parseInt($('#nbMess')[0].className),
				classTmp = $('#nbMess')[0].className,
				idUserSelect = data.myId,
				testContainer = $('container-chat' + idUserSelect),
				users = $('#container-users');

			if (!index) {
				index = 0;
			}

			$('<div/>', {
				class: 'container-message',
				id: 'cont' + index,
				appendTo: $('#container-chat' + idUserSelect)
			});
			$('<div/>', {
				class: 'talk-bubble tri-right round left-in',
				id: 'mess' + index,
				appendTo: $('#cont' + index)
			});
			$('<div/>', {
				class: 'talktext',
				appendTo: $('#mess' + index)
			}).text(data.message);
			if ($('#container-chat' + idUserSelect)[0]) {
				$('#container-chat' + idUserSelect).animate(
					{ scrollTop: $('#container-chat' + idUserSelect)[0].scrollHeight },
					1000
				);
			}
			let check = false;
			users.children('div').each(function() {
				if (this.classList.contains('select')) {
					if ($('#' + this.id)[0].id == idUserSelect) {
						check = true;
					}
				}
			});
			if (check == false) {
				$('#' + idUserSelect).addClass('notifs');
			}
			$('#nbMess').removeClass(classTmp).addClass((index + 1).toString());
			$('#input-chat').val('');
		});

		this.webSocket.on('notifMess', (notifMess) => {
			$('#round-nb').css('display', 'inline-flex');
			$('#nb').text(notifMess.nbNotifs);
			if (notifMess.connected) {
				$('#connect-users').addClass('con');
			} else {
				$('#connect-users').removeClass('con');
			}
		});

		// m'affiche que l'user vu est connecter ou pas sur browse/profil
		this.webSocket.on('online', (classColor) => {
			if (classColor.class === 'green') {
				$('#lastConnect').remove();
				$('#online').removeClass('red');
				$('#online').addClass('green');
			} else {
				let disconnect = classColor.disconnect;

				$('#online').removeClass('green');
				$('#online').addClass('red');
				$('<div/>', {
					id: 'lastConnect',
					class: 'lastConnect',
					appendTo: $('#text1-account')
				}).text('Deconnecté depuis le : ' + disconnect);
			}
		});

		this.webSocket.on('getOnlineUser', (classColorId) => {
			if (classColorId.status === 'connect') {
				$('#' + classColorId.idUser).removeClass('offline');
			} else if (classColorId.status === 'disconnect') {
				$('#' + classColorId.idUser).addClass('offline');
			}
		});
		// Affiche aux autres que je suis connecter ou pas
		this.webSocket.on('onlineMe', (connected) => {
			if (connected.status === 'connected') {
				$('#lastConnect').remove();
				$('#online').removeClass('red');
				$('#online').addClass('green');
				$('#' + connected.id).removeClass('offline');
			} else if (connected.status === 'disconnect') {
				let disconnect = connected.disconnect;

				$('#lastConnect').remove();
				$('#online').removeClass('green');
				$('#online').addClass('red');
				$('#' + connected.id).addClass('offline');
				if (disconnect) {
					$('<div/>', {
						id: 'lastConnect',
						class: 'lastConnect',
						appendTo: $('#text1-account')
					}).text('Deconnecté depuis le : ' + disconnect);
				}
			}
		});

		this.webSocket.on('visit', (visit) => {
			$('#round-nb').css('display', 'inline-flex');
			$('#nb').text(visit);
		});

		this.webSocket.on('like', (like) => {
			$('#round-nb').css('display', 'inline-flex');
			$('#nb').text(like.nbNotifs);
			if (like.connected) {
				$('#connect-users').addClass('con');
			} else {
				$('#connect-users').removeClass('con');
			}
		});

		this.webSocket.on('likeSession', (like) => {
			if (like.status || like === true) {
				$('#like-profil').css('background-image', 'url("/images/like/like.png")');
				if (like.connected) {
					$('#connect-users').addClass('con');
				}
			} else {
				$('#like-profil').css('background-image', 'url("/images/like/unlike.png")');
				$('#connect-users').removeClass('con');
			}
		});
		this.webSocket.on('likeSessionError', (error) => {
			$('#error').text(error).addClass('red');
		});
	},
	visit: (idUserProfil) => {
		if (!webSocket) {
			return false;
		}
		this.webSocket.emit('visit', idUserProfil);
	},
	like: (idUserProfil) => {
		if (!webSocket) {
			return false;
		}
		this.webSocket.emit('like', idUserProfil);
	},
	message: (userId, message) => {
		if (!webSocket) {
			return false;
		}

		this.webSocket.emit('message', { userId: userId, message: message });
	},
	online: (idUserProfil) => {
		if (!webSocket) {
			return false;
		}
		this.webSocket.emit('online', idUserProfil);
	},
	onlineMe: () => {
		if (!webSocket) {
			return false;
		}
		this.webSocket.emit('onlineMe', {});
	},
	getOnlineUser: (idUserProfil) => {
		if (!webSocket) {
			return false;
		}
		this.webSocket.emit('getOnlineUser', idUserProfil);
	}
};

window.socketClient = socketClient;
window.addEventListener('load', socketClient.init, false);
