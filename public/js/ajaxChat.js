let idUserSelect = parseInt($('#chatUser')[0].className);

$('#container-chat' + idUserSelect).scrollTop($('#container-chat' + idUserSelect)[0].scrollHeight);

window.addEventListener('load', () => {
	let id_user_visit = $('#online-hidden').text();

	if (id_user_visit) {
		socketClient.onlineMe(id_user_visit);
	}
});

$('#input-chat').on('keydown', function search(e) {
	if (e.keyCode == 13) {
		let users = $('#container-users');

		if ($(this).val() !== '') {
			let mess = $(this).val();

			users.children('div').each(function() {
				if (this.classList.contains('select')) {
					socketClient.message($('#' + this.id)[0].id, mess);
				}
			});
		}
	}
});

function changeUserChat(id_user, myId) {
	$.post('/chat/Change-User', { user: id_user }, function(data, textStatus, jqXHR) {
		var dataRes = JSON.parse(jqXHR.responseText, (getIdUser = $('#chatUser')[0].className));

		$('#chatUser').removeClass(getIdUser).addClass(id_user.toString());
		// debugger;

		let users = $('#container-users'),
			idUserSelect = parseInt($('#chatUser')[0].className);

		users.children('div').each(function() {
			if (this.classList.contains('select')) {
				$('#' + this.id).removeClass('select');
			}
		});
		$('#' + id_user).addClass('select');

		//supprime les messages
		$('#container-chat' + getIdUser).remove();
		$('#input-chat').remove();
		$('#login-chat').text(dataRes.response.login[0].login);
		$('#' + idUserSelect).removeClass('notifs');

		//Les reconstruits avec le nouvel user
		$('<div/>', {
			id: 'container-chat' + id_user,
			class: 'container-chat',
			appendTo: $('#containerProfilsBrowse')
		});
		dataRes.response.messages.map((mess, index) => {
			$('<div/>', {
				id: 'cont' + index,
				class: 'container-message',
				appendTo: $('#container-chat' + id_user)
			});
			$('<div/>', {
				id: 'mess' + index,
				class: mess.id_user1 == myId
					? 'talk-bubble tri-right round right-in me'
					: 'talk-bubble tri-right round left-in',
				appendTo: $('#' + 'cont' + index)
			});
			$('<div/>', {
				class: 'talktext',
				appendTo: $('#' + 'mess' + index)
			}).text(mess.message);
		});
		$('<input/>', {
			id: 'input-chat',
			class: 'tags-input-account input-chat',
			type: 'text',
			placeholder: 'Tape ton texte et appuis sur la touche entrée...',
			autofocus: 'true',
			appendTo: $('#containerProfilsBrowse')
		});
		$('#container-chat' + id_user).scrollTop($('#container-chat' + id_user)[0].scrollHeight);
		$('#input-chat').trigger('focus');

		$('#input-chat').on('keydown', function search(e) {
			if (e.keyCode == 13) {
				let users = $('#container-users');

				if ($(this).val() !== '') {
					let mess = $(this).val();

					users.children('div').each(function() {
						if (this.classList.contains('select')) {
							socketClient.message($('#' + this.id)[0].id, mess);
						}
					});
				}
			}
		});
	});
}
