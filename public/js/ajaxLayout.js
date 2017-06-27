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
	$('#round-nb').css('display', 'none');
	displayNotifs();
	$('#imgNotifs').addClass('expend');
});

function displayNotifs() {
	let check = $('#developpe-notif').css('display');

	$.post('/notifications', {}, function(data, textStatus, jqXHR) {
		var dataRes = JSON.parse(jqXHR.responseText);

		if (dataRes.response.notifs && dataRes.response.notifs.length) {
			let data = dataRes.response.notifs;

			$('#developpe-notif').css('display', 'flex');
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
				let action = '';

				if (notif.action === 'visit') {
					action = ' a visité votre profil le ';
				} else if (notif.action === 'like') {
					action = notif.likeUnlike == true
						? ' a liké votre profil le '
						: ' ne like plus votre profil depuis le ';
				} else if (notif.action === 'message') {
					action = ' vous a laissé un message le ';
				}
				let login = notif.login_user_visit,
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
	$.post('/remove-notifications', {}, function(data, textStatus, jqXHR) {
		var dataRes = JSON.parse(jqXHR.responseText);

		removeNotif();
		$('#round-nb').css('display', 'none');
	});
}

function showHide() {
	var x = document.getElementById('myTopnav'),
		y = document.getElementById('header');
	if (x.className === 'topnav') {
		x.className += ' responsive';
	} else {
		x.className = 'topnav';
	}
	if (y.className === 'header') {
		y.className += ' responsive';
	} else {
		y.className = 'header';
	}
}
