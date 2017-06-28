/**
 * Created by jbmar on 16/05/2017.
 */

// $(function() {
// 	$('#birthdayAccountInput').datepicker({ dateFormat: 'yy-mm-dd' });
// 	checkIfInputIsModify('birthday');
// });

function submitPhoto() {
	$('#frmUploader').ajaxSubmit({
		success: showResponse
	});
	return false;
}

function showResponse(responseText, statusText, xhr, $form) {
	let dataRes = JSON.parse(xhr.responseText),
		divError = $('#error'),
		countElems = 0;

	if (dataRes.isErr == 0) {
		$('.div-photo-user').each((index) => {
			countElems++;
		});
		if (countElems == 1) {
			if (
				$('.div-photo-user').css('background-image') ===
				'url("http://localhost:3000/images/upload/default-user.png")'
			) {
				$('.div-photo-user').remove();
			}
		}
		$('<div/>', {
			id: dataRes.response.idPhoto,
			class: 'div-photo-user no-img',
			css: {
				'background-image': 'url(' + dataRes.response.srcPhoto + ')'
			},
			prependTo: $('#photos-user-account'),
			on: {
				click: function() {
					interactPhoto(dataRes.response.idPhoto);
				}
			}
		});
		if (dataRes.response.fav) {
			let imgStar = $('<img/>', {
				id: 'imgStar',
				class: 'imgStar ajax-add',
				src: '/images/tools/star.png',
				prependTo: $('#' + dataRes.response.idPhoto)
			});
			// $('#' + dataRes.response.idPhoto).addClass('star').after(imgStar);
		}
		if ($('.div-photo-user').length >= 5) {
			$('.input-file-trigger').css('display', 'none');
		}
	}

	if ((dataRes.isErr === 0 || dataRes.isErr === 1) && dataRes.response) {
		divError.removeClass('red green');
		dataRes.isErr === 1 ? divError.addClass('red') : divError.addClass('green');
		dataRes.isErr === 1 ? divError.text(dataRes.response) : divError.text(dataRes.response.mess);
		$('#formAccount').css('margin-top', '54px');
	}
}

$('body').on('click', function(e) {
	if (
		e.target.classList.contains('div-photo-user') ||
		e.target.classList.contains('del') ||
		e.target.classList.contains('profil')
	) {
		return false;
	}
	reduceInteract();
});

function reduceInteract() {
	$('#interact-photos').removeClass('expand');
	$('.div-photo-user').removeClass('profil');
	$('#imgStar').removeClass('profilStar');
	// $('#interact-photos').css('display', 'none');
}

function interactPhoto(photoId) {
	var divError = $('#error');

	divError.removeClass('red green');

	function setDisplay() {
		return new Promise((resolve) => {
			$('#interact-photos').css('display', 'block');
			resolve();
		});
	}

	setDisplay().then(() => {
		$('.div-photo-user').removeClass('profil');
		$('#' + photoId).addClass('profil');
		$('#imgStar').addClass('profilStar');
		$('#button-del-account').off('click').on('click', function() {
			removePhoto(photoId);
		});
		$('#button-profil-account').off('click').on('click', function() {
			addFavoritePhoto(photoId);
		});
		$('#interact-photos').addClass('expand');
	});
}

function removePhoto(idPhoto) {
	// Je supprime la favorite ?
	let testIfStar = false;
	if ($('#' + idPhoto)[0].firstChild) {
		testIfStar = $('#' + idPhoto)[0].firstChild.classList.contains('imgStar') ? true : false;
	}

	$.post(
		'/account/Delete',
		{
			id: idPhoto
		},
		function(data, textStatus, jqXHR) {
			var dataRes = JSON.parse(jqXHR.responseText),
				divError = $('#error');

			divError.removeClass('red green');
			dataRes.isErr === 1 ? divError.addClass('red') : divError.addClass('green');

			divError.text(dataRes.response);
			$('#' + idPhoto).remove();
			if ($('.div-photo-user').length <= 5) {
				$('.input-file-trigger').css('display', 'inline-block');
			}
			if ($('.div-photo-user').length < 1) {
				$('<div/>', {
					id: 'noPhotoUpload',
					class: 'div-photo-user no-photo',
					css: {
						'background-image': 'url("/images/upload/default-user.png")',
						cursor: 'initial'
					},
					prependTo: $('#photos-user-account')
				});
			}
			// C'ete la favorite ?
			if (testIfStar) {
				let count = 0;

				$('#imgStar').remove();

				if (dataRes.isErr == 0) {
					$('.div-photo-user').each((index, val) => {
						let style = val.style;

						if (style.backgroundImage !== '/images/upload/default-user.png' && count == 0) {
							addFavoritePhoto(val.id);
							count++;
						}
					});
					reduceInteract();
				}
			}
		}
	);
}

function addFavoritePhoto(idPhoto) {
	$.post(
		'/account/Favorite',
		{
			id: idPhoto
		},
		function(data, textStatus, jqXHR) {
			var dataRes = JSON.parse(jqXHR.responseText),
				divError = $('#error');
			divError.removeClass('red green');
			if (dataRes.response.favorite !== 0 && dataRes.response.favorite !== 1) {
				dataRes.isErr === 1 ? divError.addClass('red') : divError.addClass('green');
				divError.text(dataRes.response.favorite);
			}
			$('#default-img-user').css('background-image', 'url(' + dataRes.response.src + ')').addClass('fav');
			$('#imgStar').remove();
			$('.div-photo-user').removeClass('star');
			let imgStar = $('<img/>', {
				id: 'imgStar',
				class: 'imgStar',
				src: '/images/tools/star.png',
				prependTo: $('#' + idPhoto)
			});
			reduceInteract();
		}
	);
}

function submitForm(input) {
	let checkInput = false;
	if ((checkInput = checkIfInputIsModify(input)) !== false) {
		$.post(
			'/account/Modify-Profil',
			{
				input: input,
				data: checkInput
			},
			function(data, textStatus, jqXHR) {
				var dataRes = JSON.parse(jqXHR.responseText),
					divError = $('#errorInfoProfil');
				divError.removeClass('red green');
				const checkInput = [ 'email', 'login', 'name', 'firstName', 'birthday' ];
				let isInfosUser = 0;
				if (checkInput.indexOf(dataRes.response.input) >= 0) {
					isInfosUser = 1;
				}
				if (dataRes.response !== 0 && dataRes.response !== 1) {
					sendResponseAfterModifyForm(dataRes, divError, isInfosUser);
				}
				if (isInfosUser === 1) {
					divError.text(dataRes.response.mess);
				}
			}
		);
	}
}

function checkIfInputIsModify(input) {
	let checkInput = '',
		diff = '';

	if (input === 'email') {
		diff = $('#hiddenEmailAccountInput').val();
		checkInput = $('#emailAccountInput').val();
		if (diff !== checkInput) {
			return checkInput;
		}
	} else if (input === 'login') {
		diff = $('#hiddenloginAccountInput').val();
		checkInput = $('#loginAccountInput').val();
		if (diff !== checkInput) {
			return checkInput;
		}
	} else if (input === 'name') {
		diff = $('#hiddenNameAccountInput').val();
		checkInput = $('#lastNameAccountInput').val();
		if (diff !== checkInput) {
			return checkInput;
		}
	} else if (input === 'firstName') {
		diff = $('#hiddenFirstNameAccountInput').val();
		checkInput = $('#firstNameAccountInput').val();
		if (diff !== checkInput) {
			return checkInput;
		}
	} else if (input === 'birthday') {
		diff = $('#birthdayAccountInput')[0].defaultValue;
		checkInput = $('#birthdayAccountInput')[0].value;
		if (diff !== checkInput) {
			return (data = { age: checkInput });
		}
	} else if (input === 'sex') {
		diff = $('input[name=input-sex-user]:checked');
		return diff[0].value;
	} else if (input === 'orientation') {
		diff = $('input[name=input-orientation-user]:checked');
		return diff[0].value;
	} else if (input === 'bio') {
		diff = $('#bioAccount')[0].defaultValue;
		checkInput = $('#bioAccount')[0].value;
		if (diff !== checkInput) {
			return checkInput;
		}
	}
	return false;
}

function sendResponseAfterModifyForm(dataRes, divError, isInfosUser) {
	if (isInfosUser) {
		dataRes.isErr === 1 ? divError.addClass('red') : divError.addClass('green');
	}
	if (dataRes.response.input === 'email') {
		$('#emailAccountInput').removeClass('red green');
		dataRes.isErr === 1 ? $('#emailAccountInput').addClass('red') : $('#emailAccountInput').addClass('green');
		if (dataRes.isErr === 0) {
			$('input.hiddenEmailRegisterInput').val(dataRes.response.data);
		}
	} else if (dataRes.response.input === 'login') {
		$('#loginAccountInput').removeClass('red green');
		dataRes.isErr === 1 ? $('#loginAccountInput').addClass('red') : $('#loginAccountInput').addClass('green');
		if (dataRes.isErr === 0) {
			var welcome = $('#welcome-account');
			$('input.hiddenloginRegisterInput').val(dataRes.response.data);
			welcome.text('Bienvenue ' + dataRes.response.data);
		}
	} else if (dataRes.response.input === 'name') {
		$('#lastNameAccountInput').removeClass('red green');
		dataRes.isErr === 1 ? $('#lastNameAccountInput').addClass('red') : $('#lastNameAccountInput').addClass('green');
		if (dataRes.isErr === 0) {
			$('input.hiddenNameRegisterInput').val(dataRes.response.data);
		}
	} else if (dataRes.response.input === 'firstName') {
		$('#firstNameAccountInput').removeClass('red green');
		dataRes.isErr === 1
			? $('#firstNameAccountInput').addClass('red')
			: $('#firstNameAccountInput').addClass('green');
		if (dataRes.isErr === 0) {
			$('input.hiddenFirstNameRegisterInput').val(dataRes.response.data);
		}
	} else if (dataRes.response.input === 'sex') {
		$('#errorInfoOrientation').removeClass('green');
		if (dataRes.isErr === 0) {
			$('#errorInfoSex').addClass('green');
			$('#errorInfoSex').text(dataRes.response.mess);
		}
	} else if (dataRes.response.input === 'orientation') {
		if (dataRes.isErr === 0) {
			$('#errorInfoOrientation').removeClass('green');
			$('#errorInfoOrientation').addClass('green');
			$('#errorInfoOrientation').text(dataRes.response.mess);
		}
	} else if (dataRes.response.input === 'bio') {
		$('#errorInfoBio').removeClass('red green');
		dataRes.isErr === 1 ? $('#errorInfoBio').addClass('red') : $('#errorInfoBio').addClass('green');
		if (dataRes.isErr === 0) {
			$('#bioAccount')[0].defaultValue = dataRes.response.data;
		}
		$('#errorInfoBio').text(dataRes.response.mess);
	}
}

function addTagToDb() {
	let val = $('#tagsInputAccount').val();
	if (val !== '') {
		val = val.replace('#', '');
		$.post(
			'/account/Add-tag',
			{
				data: val
			},
			function(data, textStatus, jqXHR) {
				var dataRes = JSON.parse(jqXHR.responseText),
					divError = $('#errorTag');
				divError.removeClass('red green');
				if (dataRes.isErr === 0) {
					$('<div/>', {
						id: dataRes.response.data,
						class: 'tags button check',
						appendTo: $('#container-tags'),
						on: {
							click: function() {
								modifyTagUser(dataRes.response.data);
							}
						}
					}).text('#' + dataRes.response.data);
				}
				dataRes.isErr === 1 ? divError.addClass('red') : divError.addClass('green');
				divError.text(dataRes.response.mess);
				$('#tagsInputAccount').val('');
			}
		);
	}
}

function modifyTagUser(tag) {
	if (tag.toString() === '[object HTMLDivElement]') {
		tag = $(tag)[0].id;
	}
	$.post(
		'/account/Click-tag',
		{
			data: tag
		},
		function(data, textStatus, jqXHR) {
			var dataRes = JSON.parse(jqXHR.responseText),
				divError = $('#errorTag');
			divError.removeClass('red green');
			if (dataRes.isErr === 0) {
				dataRes.response.insertOrDelette === true
					? $('#' + tag).removeClass('check')
					: $('#' + tag).addClass('check');
			}
			dataRes.isErr === 1 ? divError.addClass('red') : divError.addClass('green');
			divError.text(dataRes.response.mess);
		}
	);
}

function initialize(lat, lng) {
	let canvas = document.getElementById('map_canvas');

	if (canvas) {
		map = new google.maps.Map(canvas, {
			zoom: 19,
			center: new google.maps.LatLng(lat ? lat : 48.858565, lng ? lng : 2.347198),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		if (lat && lng) {
			let marker = new google.maps.Marker({
				position: new google.maps.LatLng(lat, lng),
				map: map
			});
		}

		if (!lat && !lng) {
			if (navigator.geolocation)
				navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 600000
				});
			else {
				alert('Votre navigateur ne prend pas en compte la géolocalisation HTML5');
			}
		}

		//connection online de l'utilisateur visite dans browse/profil
		let id_user_visit = $('#online-hidden').text();

		if (id_user_visit) {
			socketClient.online(id_user_visit);
		}
		socketClient.onlineMe();
	}

	function successCallback(position) {
		var geocoder = new google.maps.Geocoder();
		map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		let marker = new google.maps.Marker({
			position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
			map: map
		});
		geocoder.geocode(
			{
				latLng: marker.position
			},
			function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					let searchAddressComponents = results[0].address_components,
						searchCity = '',
						searchCountry = '';
					$.each(searchAddressComponents, function() {
						if (this.types[0] == 'locality') {
							searchCity = this.long_name;
						}
						if (this.types[0] == 'country') {
							searchCountry = this.long_name;
						}
					});
					// if geocode success
					let infos = {
						address: results[0].formatted_address,
						lat: position.coords.latitude,
						lng: position.coords.longitude,
						city: searchCity,
						country: searchCountry
					};

					$('#autocomplete').val(results[0].formatted_address);
					$.post('/account/Get-location', infos, function(data, textStatus, jqXHR) {});
				}
			}
		);
	}

	function errorCallback(error) {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				getLocalisationWithoutAgreeOfUser();
				break;
			case error.POSITION_UNAVAILABLE:
				getLocalisationWithoutAgreeOfUser();
				break;
			case error.TIMEOUT:
				getLocalisationWithoutAgreeOfUser();
				break;
		}
	}
}

function getLocalisationWithoutAgreeOfUser() {
	$.getJSON('https://geoip-db.com/json/geoip.php?jsonp=?').done(function(location) {
		var address = location.postal + ' ' + location.city + ', ' + location.state + ', ' + location.country_name;
		$('#autocomplete').val(address);
		let infos = {
			address: address,
			lat: location.latitude,
			lng: location.longitude,
			city: location.city,
			country: location.country_name
		};
		$.post('/account/Get-location', infos, function(data, textStatus, jqXHR) {});
		initialize(location.latitude, location.longitude);
		$('#errorLocation').addClass('green').text('Ta localisation est trouvée et enregistrée contre ton gré !');
	});
}

let placeSearch, autocomplete;
let componentForm = {
	street_number: 'short_name',
	route: 'long_name',
	locality: 'long_name',
	administrative_area_level_1: 'short_name',
	country: 'long_name',
	postal_code: 'short_name'
};

function initAutocomplete() {
	autocomplete = new google.maps.places.Autocomplete(
		/** @type {!HTMLInputElement} */
		document.getElementById('autocomplete'),
		{
			types: [ 'geocode' ]
		}
	);
	autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
	let place = autocomplete.getPlace();

	geocoder = new google.maps.Geocoder();
	codeAddress()
		.then((latLng) => {
			$('#errorLocation').removeClass('red green');
			if (latLng !== false) {
				let infos = {
					address: place.formatted_address,
					lat: latLng.lat,
					lng: latLng.lng,
					city: latLng.city,
					country: latLng.country
				};
				$.post('/account/Get-location', infos, function(data, textStatus, jqXHR) {});
				initialize(latLng.lat, latLng.lng);
				$('#errorLocation').addClass('green').text('Ton addresse est bien modifiée!');
			} else {
				$('#errorLocation')
					.addClass('red')
					.text("Soit plus precis sur l'addresse... ex: numero de rue, arrondissement, code postal");
			}
		})
		.catch((err) => {
			$('#errorLocation')
				.addClass('red')
				.text("Soit plus precis sur l'addresse... ex: numero de rue, arrondissement, code postal");
			console.error(err);
		});
}

function codeAddress() {
	return new Promise((resolve, reject) => {
		var address = document.getElementById('autocomplete').value;

		geocoder.geocode(
			{
				address: address
			},
			function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					let searchAddressComponents = results[0].address_components,
						searchPostalCode = '',
						searchCity = '',
						searchCountry = '';

					$.each(searchAddressComponents, function() {
						if (this.types[0] == 'postal_code') {
							searchPostalCode = this.short_name;
						}
						if (this.types[0] == 'locality') {
							searchCity = this.long_name;
						}
						if (this.types[0] == 'country') {
							searchCountry = this.long_name;
						}
					});
					let latLng = {
						lat: results[0].geometry.location.lat(),
						lng: results[0].geometry.location.lng(),
						postal_code: searchPostalCode,
						city: searchCity,
						country: searchCountry
					};
					if (searchPostalCode !== '') {
						resolve(latLng);
					} else {
						resolve(false);
					}
				} else {
					reject('Geocode was not successful for the following reason: ' + status);
				}
			}
		);
	});
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var geolocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			var circle = new google.maps.Circle({
				center: geolocation,
				radius: position.coords.accuracy
			});
			autocomplete.setBounds(circle.getBounds());
		});
	}
}

function changeTagsDisplay() {
	$.post('/account/Update-tags', {}, function(data, textStatus, jqXHR) {
		var dataRes = JSON.parse(jqXHR.responseText);

		if ($('.switch-input').is(':checked') === false) {
			$('#errorTag').empty().removeClass('green red');
			$('#new-tag').css('display', 'block');
			$('#container-tags').empty();
			for (let i = 0; i < dataRes.response.tags.length; i++) {
				$('<div/>', {
					id: dataRes.response.tags[i].tag,
					class: dataRes.response.check[i].idTag === dataRes.response.tags[i].id &&
						dataRes.response.check[i].check
						? 'tags button check'
						: 'tags button',
					appendTo: $('#container-tags'),
					on: {
						click: function() {
							modifyTagUser(dataRes.response.tags[i].tag);
						}
					},
					text: '#' + dataRes.response.tags[i].tag
				});
			}
		} else {
			$('#errorTag').empty().removeClass('green red');
			$('#new-tag').css('display', 'none');
			$('#container-tags').empty();
			for (let i = 0; i < dataRes.response.tagsUser.length; i++) {
				$('<div/>', {
					id: dataRes.response.tagsUser[i].tag,
					class: 'tags button check',
					appendTo: $('#container-tags'),
					on: {
						click: function() {
							modifyTagUser(dataRes.response.tagsUser[i].tag);
						}
					},
					text: '#' + dataRes.response.tagsUser[i].tag
				});
			}
		}
	});
}

$('#tagsInputAccount').on('keypress', function() {
	$.post('/account/Update-tags', {}, function(data, textStatus, jqXHR) {
		const dataRes = JSON.parse(jqXHR.responseText);
		let list = [];

		for (let i = 0; i < dataRes.response.tags.length; i++) {
			list[i] = {
				value: dataRes.response.tags[i].tag,
				idTag: dataRes.response.check[i].idTag,
				id: dataRes.response.tags[i].id,
				check: dataRes.response.check[i].check
			};
		}

		$('#tagsInputAccount').autocomplete({
			source: list,
			minLength: 0,

			select: function(event, ui) {
				modifyTagUser(ui.item.value);
				$.post('/account/Update-tags', {}, function(data, textStatus, jqXHR) {
					var dataRes = JSON.parse(jqXHR.responseText);

					$('#container-tags').empty();
					for (let i = 0; i < dataRes.response.tags.length; i++) {
						$('<div/>', {
							id: dataRes.response.tags[i].tag,
							class: dataRes.response.check[i].idTag === dataRes.response.tags[i].id &&
								dataRes.response.check[i].check
								? 'tags button check'
								: 'tags button',
							appendTo: $('#container-tags'),
							on: {
								click: function() {
									modifyTagUser(dataRes.response.tags[i].tag);
								}
							},
							text: '#' + dataRes.response.tags[i].tag
						});
					}
					$('#tagsInputAccount').val('');
				});
			},
			response: function(event, ui) {
				$('#errorTag').empty().removeClass('green red');
				$('#container-tags').empty();
				for (let i = 0; i < ui.content.length; i++) {
					$('<div/>', {
						id: ui.content[i].value,
						class: ui.content[i].idTag === ui.content[i].id && ui.content[i].check
							? 'tags button check'
							: 'tags button',
						appendTo: $('#container-tags'),
						on: {
							click: function() {
								modifyTagUser(ui.content[i].value);
							}
						},
						text: '#' + ui.content[i].value
					});
				}
			}
		});
	});
});
