function displayFilterTagsOptions() {
	let buttonFilter = $('#containerTagsOption');

	if (buttonFilter[0].style.display === 'none') {
		const users = $('#separator-profil');
		if (users[0] && users[0].childNodes.length > 0) {
			$('.fitres-tags').css('margin', '0 auto 50px');
			$('#containerTrieOptions').css('display', 'none');
			$('#containerFiltersOptions').css('display', 'none');
			buttonFilter.css('display', 'block');
		}
	} else {
		buttonFilter.css('display', 'none');
	}
}
