/**
 * Created by jmarsal on 6/7/17.
 */

function displayTrieOptions(page) {
	let buttonFilter = $('#containerTrieOptions');

	if (buttonFilter[0].style.display === 'none') {
		$('#containerFiltersOptions').css('display', 'none');
		$('#containerTagsOption').css('display', 'none');
		buttonFilter.css('display', 'block');
		displayOptions(page, 'TOP');
	} else {
		buttonFilter.css('display', 'none');
	}
}

function displayFilterOptions(page) {
	let buttonFilter = $('#containerFiltersOptions');

	if (buttonFilter[0].style.display === 'none') {
		let urlPost = page === 'browse' ? '/browse/Change-Filters-Intervals' : '/search/Change-Filters-Intervals';

		$.post(urlPost, {}, function(data, textStatus, jqXHR) {
			var dataRes = JSON.parse(jqXHR.responseText),
				divError = $('#error'),
				dataToSend = {
					distance: 'distanceFromUserKm',
					minDistance: dataRes.response.minMax.minDistanceKm,
					maxDistance: dataRes.response.minMax.maxDistanceKm,
					tags: 'tagsCommun',
					minTags: dataRes.response.minMax.minTags,
					maxTags: dataRes.response.minMax.maxTags,
					pop: 'popularity',
					minPop: dataRes.response.minMax.minPop,
					maxPop: dataRes.response.minMax.maxPop,
					age: 'age',
					minAge: dataRes.response.minMax.minAge,
					maxAge: dataRes.response.minMax.maxAge
				};

			divError.removeClass('red green');
			dataRes.isErr === 1 ? divError.addClass('red') : '';
			dataRes.isErr === 1 ? divError.text(dataRes.response) : '';
			if (dataRes.response.minMax.maxAge) {
				$('#containerTrieOptions').css('display', 'none');
				$('#containerTagsOption').css('display', 'none');
				buttonFilter.css('display', 'block');
				$('.fitres-tags').css('margin', '30 auto 50px');
				setIntervalsMinMax(
					'slider-distance',
					dataRes.response.minMax.minDistanceKm,
					dataRes.response.minMax.maxDistanceKm,
					'Km'
				);
				setIntervalsMinMax('slider-tags', dataRes.response.minMax.minTags, dataRes.response.minMax.maxTags, '');
				setIntervalsMinMax('slider-pop', dataRes.response.minMax.minPop, dataRes.response.minMax.maxPop, '%');
				setIntervalsMinMax('slider-age', dataRes.response.minMax.minAge, dataRes.response.minMax.maxAge, 'ans');
				$('#slider-distance').slider({
					change: function(event, ui) {
						(dataToSend.distance = 'distanceFromUserKm'), (dataToSend.minDistance =
							ui.values[0]), (dataToSend.maxDistance = ui.values[1]);
						modifyUsersByIntervals(dataToSend, urlPost);
					}
				});

				$('#slider-tags').slider({
					change: function(event, ui) {
						(dataToSend.tags = 'tagsCommun'), (dataToSend.minTags = ui.values[0]), (dataToSend.maxTags =
							ui.values[1]);

						modifyUsersByIntervals(dataToSend, urlPost);
					}
				});

				$('#slider-pop').slider({
					change: function(event, ui) {
						(dataToSend.pop = 'popularity'), (dataToSend.minPop = ui.values[0]), (dataToSend.maxPop =
							ui.values[1]);

						modifyUsersByIntervals(dataToSend, urlPost);
					}
				});

				$('#slider-age').slider({
					change: function(event, ui) {
						(dataToSend.age = 'age'), (dataToSend.minAge = ui.values[0]), (dataToSend.maxAge =
							ui.values[1]);
						modifyUsersByIntervals(dataToSend, urlPost);
					}
				});
			} else {
				buttonFilter.css('display', 'none');
				$('.fitres-tags').css('margin', '0 auto 50px');
			}
		});
	} else {
		buttonFilter.css('display', 'none');
		$('.fitres-tags').css('margin', '0 auto 50px');
	}
}

function modifyUsersByIntervals(dataToSend, urlPost) {
	let newUrlPost = urlPost === '/search/Change-Filters-Intervals'
		? '/search/New-Users-Filters-Intervals'
		: '/browse/New-Users-Filters-Intervals';

	$.post(newUrlPost, dataToSend, function(data, textStatus, jqXHR) {
		var dataRes = JSON.parse(jqXHR.responseText),
			divError = $('#errorSlide');

		divError.removeClass('red green');
		dataRes.isErr === 1 ? divError.addClass('red') : '';
		dataRes.isErr === 1 ? divError.text(dataRes.response.mess) : '';

		rebaseBrowseUsers(dataRes.response);
	});
}

function setIntervalsMinMax(slider, min, max, unite) {
	$('#' + slider).slider({
		range: true,
		min: min,
		max: max,
		values: [ min, max ],
		slide: function(event, ui) {
			$('#amount-' + slider).val(ui.values[0] + ' ' + unite + '   ' + ui.values[1] + ' ' + unite + '');
		}
	});
	$('#amount-' + slider).val(
		$('#' + slider).slider('values', 0) +
			' ' +
			unite +
			'  -  ' +
			$('#' + slider).slider('values', 1) +
			' ' +
			unite +
			' '
	);
}

function displayOptions(page, valeur) {
	let dataToSend = {
		data: valeur
	};

	$('#containerTrieOptions>div.activeTrie').removeClass('activeTrie');
	if (valeur === 'ASC') {
		$('#optionASC').addClass('activeTrie');
	} else if (valeur === 'DESC') {
		$('#optionDESC').addClass('activeTrie');
	} else if (valeur === 'TAGS') {
		$('#optionTAGS').addClass('activeTrie');
	} else if (valeur === 'POP') {
		$('#optionPOP').addClass('activeTrie');
	} else if (valeur === 'AgeASC') {
		$('#optionAgeASC').addClass('activeTrie');
	} else if (valeur === 'AgeDESC') {
		$('#optionAgeDESC').addClass('activeTrie');
	} else if (valeur === 'TOP') {
		$('#optionTOP').addClass('activeTrie');
	}

	let urlPost = page === 'browse' ? '/browse/Change-Filters-Trie' : '/search/Change-Filters-Trie';

	$.post(urlPost, dataToSend, function(data, textStatus, jqXHR) {
		var dataRes = JSON.parse(jqXHR.responseText),
			divError = $('#error');

		divError.removeClass('red green');
		dataRes.isErr === 1 ? divError.addClass('red') : '';
		dataRes.isErr === 1 ? divError.text(dataRes.response) : '';
		// debugger;
		rebaseBrowseUsers(dataRes.response);
	});
}

function rebaseBrowseUsers(data) {
	$('#containerProfilsBrowse').remove();
	$('<div/>', {
		id: 'containerProfilsBrowse',
		class: 'container-profils-browse',
		appendTo: $('#contentAccountUser')
	});
	$('<div/>', {
		class: 'separator-profil',
		id: 'separatorProfil',
		appendTo: $('#containerProfilsBrowse')
	});
	// if (data && data.length && data.profilsOrder) {
	data.profilsOrder.map((profil) => {
		$('<div/>', {
			id: profil.id,
			class: 'profil-browse',
			appendTo: $('#separatorProfil')
		});
		$('<div/>', {
			class: 'infos-profil-browse',
			id: 'infosProfilBrowse' + profil.id,
			on: {
				click: function() {
					printDetailsProfils(profil.id);
				}
			},
			appendTo: $('#' + profil.id)
		});
		$('<div/>', {
			class: 'login-profil-browse infos',
			id: 'loginProfilBrowse' + profil.id,
			appendTo: $('#infosProfilBrowse' + profil.id)
		}).text(profil.login + '    ' + profil.age + ' ans');

		data.photos.map((photo) => {
			if (photo.id_user == profil.id) {
				$('<div/>', {
					class: 'info-pop-tag',
					id: 'infoPopTag' + profil.id,
					appendTo: $('#infosProfilBrowse' + profil.id)
				});
				$('<div/>', {
					class: 'popularity-browse',
					id: 'popularityBrowse' + profil.id,
					appendTo: $('#infoPopTag' + profil.id)
				}).text('Popularité: ' + profil.popularity + '%');
				$('<div/>', {
					class: 'commun-tags-browse',
					id: 'communTagsBrowse' + profil.id,
					appendTo: $('#infoPopTag' + profil.id)
				}).text('#: ' + profil.tagsCommun + ' commun');
				$('<div/>', {
					class: 'photo-profil-browse',
					id: 'photoProfilBrowse' + profil.id,
					css: {
						'background-image': 'url(' + photo.src_photo + ')'
					},
					appendTo: $('#infosProfilBrowse' + profil.id)
				});
			}
		});
		$('<div/>', {
			class: 'primary-infos',
			id: 'primaryInfos' + profil.id,
			appendTo: $('#infosProfilBrowse' + profil.id)
		});
		$('<div/>', {
			class: 'localite-infos',
			id: 'localiteInfos' + profil.id,
			appendTo: $('#primaryInfos' + profil.id)
		}).text(profil.city + ' ' + (profil.country === 'États-Unis' ? 'aux' : 'en') + ' ' + profil.country);
		$('<div/>', {
			class: 'secondary-infos',
			id: 'secondaryInfos' + profil.id,
			appendTo: $('#infosProfilBrowse' + profil.id)
		});
		$('<div/>', {
			class: 'about-me infos',
			id: 'aboutMe' + profil.id,
			appendTo: $('#secondaryInfos' + profil.id)
		}).text('A propos de moi :');
		$('<div/>', {
			class: 'about',
			id: 'about' + profil.id,
			appendTo: $('#secondaryInfos' + profil.id)
		});
		$('<div/>', {
			class: 'bio-browse',
			id: 'bioBrowse' + profil.id,
			appendTo: $('#about' + profil.id)
		}).text(profil.bio);
		$('<div/>', {
			class: 'looking-for infos',
			id: 'lookingFor' + profil.id,
			appendTo: $('#secondaryInfos' + profil.id)
		}).text('Je recherche :');
		if (profil.orientation == 1) {
			$('<div/>', {
				class: 'looking',
				id: 'looking' + profil.id,
				appendTo: $('#secondaryInfos' + profil.id)
			}).text('un homme');
		} else if (profil.orientation == 2) {
			$('<div/>', {
				class: 'looking',
				id: 'looking' + profil.id,
				appendTo: $('#secondaryInfos' + profil.id)
			}).text('une femme');
		} else {
			$('<div/>', {
				class: 'looking',
				id: 'looking' + profil.id,
				appendTo: $('#secondaryInfos' + profil.id)
			}).text('un homme ou une femme');
		}
		$('<div/>', {
			class: 'separator-profil',
			id: 'separatorProfil',
			appendTo: $('#' + profil.id)
		});
	});
	// }
}

function printDetailsProfils(idUser) {
	socketClient.visit(idUser);
	window.location.replace('/browse/profil' + encodeURI('?user=' + idUser));
}

function displayLarge(idPhoto) {
	$('.active').removeClass('active');
	$('#' + idPhoto).addClass('active');
}

function displayNormalise() {
	$('.active').removeClass('active');
}

$('body').on('click', (e) => {
	if (e.target.classList.contains('active')) {
		return false;
	}
	displayNormalise();
});

function cleanArray(actual) {
	var newArray = new Array();
	for (var i = 0; i < actual.length; i++) {
		if (actual[i]) {
			newArray.push(actual[i]);
		}
	}
	return newArray;
}

function searchWithTags(tag) {
	let arrayTags = [],
		i = 0;

	if (tag.toString() === '[object HTMLDivElement]') {
		tag = $(tag)[0].id;
	}

	let check = $('#' + tag)[0].classList.contains('check') ? 1 : 0;
	if (check == 0) {
		$('#' + tag).addClass('check');
	} else {
		$('#' + tag).removeClass('check');
	}
	$('#container-tags').children('div').each(function() {
		if (this.classList.contains('check')) {
			arrayTags[i] = this.id;
		}
		i++;
	});

	arrayTags = cleanArray(arrayTags);
	$.post(
		'/search/Click-tag',
		{
			data: arrayTags
		},
		function(data, textStatus, jqXHR) {
			var dataRes = JSON.parse(jqXHR.responseText),
				divError = $('#errorTag');

			divError.removeClass('red green');
			dataRes.isErr == 1 ? divError.addClass('red') : divError.addClass('');
			divError.text(dataRes.response.mess);
			rebaseBrowseUsers(dataRes.response);
		}
	);
}

function removeCheckTags() {
	let tags = $('#container-tags');

	tags.children('div').each(function() {
		if (this.classList.contains('check')) {
			$('#' + this.id).removeClass('check');
		}
	});
	$.post(
		'/search/Click-tag',
		{
			data: []
		},
		function(data, textStatus, jqXHR) {
			var dataRes = JSON.parse(jqXHR.responseText),
				divError = $('#errorTag');

			divError.removeClass('red green');
			divError.text(dataRes.response.mess);
			rebaseBrowseUsers(dataRes.response);
		}
	);
}

function userLike(idUser) {
	socketClient.like(idUser);
}

document.addEventListener('load', () => {
	let id_user_visit = $('#online-hidden').text();

	if (id_user_visit) {
		socketClient.online(id_user_visit);
	}
});

function userConnected() {
	if ($('#online')[0].classList.contains('green')) {
		$('#online')[0].title = 'Utilisateur en ligne !';
	} else {
		$('#online')[0].title = 'Utilisateur Déconnecté !';
	}
}

function reportLockUser(action) {
	let id_user_visit = $('#online-hidden').text();

	if (id_user_visit) {
		$.post(
			'/browse/reportLockUser',
			{
				user: id_user_visit,
				action: action
			},
			function(data, textStatus, jqXHR) {
				var dataRes = JSON.parse(jqXHR.responseText),
					divError = $('#error');
				divError.removeClass('red green');
				socketClient.like(id_user_visit);
				window.location.replace('../search');
				dataRes.isErr == 1 ? divError.addClass('red') : divError.addClass('green');
				dataRes.isErr == 1 ? divError.text(dataRes.response.mess) : '';
				if (dataRes.isErr == 0) {
					divError.text(
						action === 'report'
							? "L'Utilisateur est reporté comme un faux compte !"
							: "L'Utilisateur est bloqué !"
					);
				}
			}
		);
	}
}
