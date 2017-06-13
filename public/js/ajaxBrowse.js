/**
 * Created by jmarsal on 6/7/17.
 */

function displayTrieOptions() {
	let buttonFilter = $('#containerTrieOptions');

	if (buttonFilter[0].style.display === 'none') {
		$('#containerFiltersOptions').css('display', 'none');
		buttonFilter.css('display', 'block');
	} else {
		buttonFilter.css('display', 'none');
	}
}

function displayFilterOptions(page) {
	let buttonFilter = $('#containerFiltersOptions');

	if (buttonFilter[0].style.display === 'none') {
		$('#containerTrieOptions').css('display', 'none');
		buttonFilter.css('display', 'block');

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
					modifyUsersByIntervals(dataToSend);
				}
			});

			$('#slider-tags').slider({
				change: function(event, ui) {
					(dataToSend.tags = 'tagsCommun'), (dataToSend.minTags = ui.values[0]), (dataToSend.maxTags =
						ui.values[1]);

					modifyUsersByIntervals(dataToSend);
				}
			});

			$('#slider-pop').slider({
				change: function(event, ui) {
					(dataToSend.pop = 'popularity'), (dataToSend.minPop = ui.values[0]), (dataToSend.maxPop =
						ui.values[1]);

					modifyUsersByIntervals(dataToSend);
				}
			});

			$('#slider-age').slider({
				change: function(event, ui) {
					(dataToSend.age = 'age'), (dataToSend.minAge = ui.values[0]), (dataToSend.maxAge = ui.values[1]);
					modifyUsersByIntervals(dataToSend);
				}
			});
		});
	} else {
		buttonFilter.css('display', 'none');
	}
}

function modifyUsersByIntervals(dataToSend) {
	$.post('/browse/New-Users-Filters-Intervals', dataToSend, function(data, textStatus, jqXHR) {
		var dataRes = JSON.parse(jqXHR.responseText), divError = $('#error');

		divError.removeClass('red green');
		dataRes.isErr === 1 ? divError.addClass('red') : '';
		dataRes.isErr === 1 ? divError.text(dataRes.response) : '';

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
		var dataRes = JSON.parse(jqXHR.responseText), divError = $('#error');

		divError.removeClass('red green');
		dataRes.isErr === 1 ? divError.addClass('red') : '';
		dataRes.isErr === 1 ? divError.text(dataRes.response) : '';

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
	data.profilsOrder.map((profil) => {
		$('<div/>', {
			id: profil.id,
			class: 'profil-browse',
			on: {
				click: function() {
					printDetailsProfils(profil.id);
				}
			},
			appendTo: $('#separatorProfil')
		});
		$('<div/>', {
			class: 'infos-profil-browse',
			id: 'infosProfilBrowse' + profil.id,
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
}

function printDetailsProfils(idUser) {
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
