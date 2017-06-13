function displayFilterTagsOptions() {
	let buttonFilter = $('#containerTagsOption');

	if (buttonFilter[0].style.display === 'none') {
		$('#containerTrieOptions').css('display', 'none');
		$('#containerFiltersOptions').css('display', 'none');
		buttonFilter.css('display', 'block');
	} else {
		buttonFilter.css('display', 'none');
	}
}
