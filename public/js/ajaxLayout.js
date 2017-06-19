// const moment = require('moment');

$('body').on('click', function(e) {
	if (
		e.target.classList.contains('container-Notifs') ||
		e.target.classList.contains('containerOneNotifs') ||
		e.target.classList.contains('notif-img') ||
		e.target.classList.contains('notif') ||
		e.target.classList.contains('remove-Notifs')
	) {
		return false;
	}
	removeNotif();
});

$('#imgNotifs').click((e) => {
	if (e.target.classList.contains('expend')) {
		return false;
	}
	displayNotifs();
	$('#imgNotifs').addClass('expend');
});

function displayNotifs() {
	let check = $('#developpe-notif').css('display');

	$.post('/notifications', {}, function(data, textStatus, jqXHR) {
		var dataRes = JSON.parse(jqXHR.responseText);

		if (dataRes.response.notifs && dataRes.response.notifs.length) {
			let data = dataRes.response.notifs;

			$('#developpe-notif').css('display', 'block');
			$('<div/>', {
				id: 'containerNotifs',
				class: 'container-Notifs',
				appendTo: $('#developpe-notif')
			});
			$('<div/>', {
				id: 'removeNotifs',
				class: 'remove-Notifs',
				on: {
					click: function() {
						removeHistoryNotifs();
					}
				},
				prependTo: $('#containerNotifs')
			}).text("Supprimer l'historique");
			data.map((notif, index) => {
				let login = notif.login_user_visit,
					action = notif.action === 'visit' ? ' a visité votre profil le ' : ' a liké votre profil le ',
					date = notif.date_visit,
					phrase = login + action + date;

				$('<div/>', {
					id: 'containerOneNotifs' + index,
					class: index % 2 == 0 ? 'first containerOneNotifs' : 'containerOneNotifs',
					on: {
						click: function() {
							printDetailsProfils(notif.id_user_visit);
						}
					},
					appendTo: $('#containerNotifs')
				});
				$('<div/>', {
					class: 'notif-img',
					id: 'notif-img' + index,
					css: {
						'background-image': 'url(' + notif.photo_user_visit + ')'
					},
					appendTo: $('#containerOneNotifs' + index)
				});
				$('<div/>', {
					id: 'notif' + index,
					class: 'notif',
					appendTo: $('#containerOneNotifs' + index)
				}).text(phrase);
			});
		}
	});
}

function removeNotif() {
	$('#containerNotifs').remove();
	$('#removeNotifs').remove();
	$('#imgNotifs').removeClass('expend');
}

function printDetailsProfils(idUser) {
	socketClient.visit(idUser);
	window.location.replace('/browse/profil' + encodeURI('?user=' + idUser));
}

function removeHistoryNotifs() {
	// alert(myId);
	// Post pour supprimer l'historique des notifs

	$.post('/remove-notifications', {}, function(data, textStatus, jqXHR) {
		var dataRes = JSON.parse(jqXHR.responseText);

		removeNotif();
		$('#round-nb').css('display', 'none');
	});
}
