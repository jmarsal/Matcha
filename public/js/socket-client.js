const socketClient = {
	webSocket: null,
	init: () => {
		this.webSocket = io.connect('http://localhost:3000');
		$('#error').removeClass('red').text('');

		this.webSocket.on('message', (message) => {
			alert(message);
		});
		this.webSocket.on('online', (classColor) => {
			if ((classColor.class = green)) {
				$('#online').removeClass('red');
				$('#online').addClass('green');
			} else {
				$('#online').removeClass('green');
				$('#online').addClass('red');
			}
		});
		this.webSocket.on('visit', (visit) => {
			$('#round-nb').css('display', 'inline-flex');
			$('#nb').text(visit);
		});
		this.webSocket.on('like', (like) => {
			$('#round-nb').css('display', 'inline-flex');
			$('#nb').text(like.nbNotifs);
		});
		this.webSocket.on('likeSession', (like) => {
			if (like.status) {
				$('#like-profil').css('background-image', 'url("/images/like/like.png")');
			} else {
				$('#like-profil').css('background-image', 'url("/images/like/unlike.png")');
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
		alert('je suis dans la socket client');
		this.webSocket.emit('online', idUserProfil);
	}
};

window.socketClient = socketClient;
window.addEventListener('load', socketClient.init, false);
