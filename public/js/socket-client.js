const socketClient = {
	webSocket: null,
	init: () => {
		this.webSocket = io.connect('http://localhost:3000');
		$('#error').removeClass('red').text('');

		this.webSocket.on('message', (message) => {
			let index = parseInt($('#nbMess')[0].className),
				classTmp = $('#nbMess')[0].className;

			$('<div/>', {
				class: 'talk-bubble tri-right round right-in me',
				id: 'mess' + index,
				appendTo: $('#container-chat')
			});
			$('<div/>', {
				class: 'talktext',
				appendTo: $('#mess' + index)
			}).text(message);

			$('#container-chat').animate({ scrollTop: $('#container-chat')[0].scrollHeight }, 1000);
			$('#nbMess').removeClass(classTmp).addClass((index + 1).toString());
			$('#input-chat').val('');
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
		// Affiche aux autres que je suis connecter ou pas
		this.webSocket.on('onlineMe', (connected) => {
			if (connected.status === 'connected') {
				$('#lastConnect').remove();
				$('#online').removeClass('red');
				$('#online').addClass('green');
			} else if (connected.status === 'disconnect') {
				let disconnect = connected.disconnect;

				$('#lastConnect').remove();
				$('#online').removeClass('green');
				$('#online').addClass('red');
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
	}
};

window.socketClient = socketClient;
window.addEventListener('load', socketClient.init, false);
