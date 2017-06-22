$('#container-chat').scrollTop($('#container-chat')[0].scrollHeight);

$('#input-chat').on('keydown', function search(e) {
	if (e.keyCode == 13) {
		if ($('.select')[0]) {
			const idToSend = $('.select')[0].id;

			if (idToSend && $(this).val() !== '') {
				socketClient.message(idToSend, $(this).val());
			}
		}
	}
});
