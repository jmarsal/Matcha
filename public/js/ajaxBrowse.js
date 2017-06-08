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

function displayFilterOptions() {
	let buttonFilter = $('#containerFiltersOptions');

	if (buttonFilter[0].style.display === 'none') {
		$('#containerTrieOptions').css('display', 'none');
		buttonFilter.css('display', 'block');

		$.post('/browse/Change-Filters-Intervals', {}, function (data, textStatus, jqXHR) {
			var dataRes = JSON.parse(jqXHR.responseText),
				divError = $('#error');

			divError.removeClass('red green');
			dataRes.isErr === 1 ? divError.addClass('red') : '';
			dataRes.isErr === 1 ? divError.text(dataRes.response) : '';

			// rebaseBrowseUsers(dataRes.response)
			setIntervalsMinMax(
				'slider-distance',
				dataRes.response.minMax.minDistance / 1000,
				dataRes.response.minMax.maxDistance / 1000,
				'Km'
			);
			// debugger;
			setIntervalsMinMax('slider-tags', dataRes.response.minMax.minTags, dataRes.response.minMax.maxTags, '');
			setIntervalsMinMax('slider-pop', dataRes.response.minMax.minPop, dataRes.response.minMax.maxPop, '%');
			setIntervalsMinMax('slider-age', dataRes.response.minMax.minAge, dataRes.response.minMax.maxAge, 'ans');
		});
	} else {
		buttonFilter.css('display', 'none');
	}
}

function setIntervalsMinMax(slider, min, max, unite) {
	$('#' + slider).slider({
		range: true,
		min: min,
		max: max,
		values: [min, max],
		slide: function (event, ui) {
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

function displayOptions(valeur) {
	let dataToSend = {
		data: valeur
	};

	$('#containerTrieOptions>div.active').removeClass('active');
	if (valeur === 'ASC') {
		$('#optionASC').addClass('active');
	} else if (valeur === 'DESC') {
		$('#optionDESC').addClass('active');
	} else if (valeur === 'TAGS') {
		$('#optionTAGS').addClass('active');
	} else if (valeur === 'POP') {
		$('#optionPOP').addClass('active');
	} else if (valeur === 'AgeASC') {
		$('#optionAgeASC').addClass('active');
	} else if (valeur === 'AgeDESC') {
		$('#optionAgeDESC').addClass('active');
	}

	$.post('/browse/Change-Filters-Trie', dataToSend, function (data, textStatus, jqXHR) {
		var dataRes = JSON.parse(jqXHR.responseText),
			divError = $('#error');

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
				click: function () {
					aChangerPlusTard(profil.id);
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

// console.log($('#amount-slider-age').slider('option', 'value'));
$('#amount-slider-age').slider({
	change: function (event, ui) {
		alert(ui.value);
	}
});