function displayNotifs() {
	$.post('/notifications', {}, function(data, textStatus, jqXHR) {
		var dataRes = JSON.parse(jqXHR.responseText);

		if (
			(dataRes.response.visits && dataRes.response.visits.length) ||
			(dataRes.response.likes && dataRes.response.likes.length)
		) {
			// let data = dataRes.response,
			// 	newArray = [],
			// 	count = 0;

			// console.log(data);
			// if (data.likes && data.visits) {
			// 	for (let i = 0; i < data.likes.length; i++) {
			// 		console.log(count);
			// if (i < data.visits.length && data.likes[i].date_visit > data.visits[i].date_visit) {
			// 	newArray.push(data.likes[i]);
			// 	newArray.push(data.visits[i]);
			// } else if (i < data.visits.length && data.likes[i].date_visit < data.visits[i].date_visit) {
			// 	newArray.push(data.visits[i]);
			// 	newArray.push(data.likes[i]);
			// } else {
			// 	newArray.push(data.likes[i]);
			// }
			// 	count++;
			// }

			// console.log(newArray);

			// if (count < data.visits.length) {
			// 	while (count < data.visits.length) {
			// 		newArray.push(data.visits[count]);
			// 		count++;
			// 	}
			// }

			// newArray.map((elem) => {
			// 	console.log(elem.date_visit);
			// });
			// }

			let createContaint = $('#developpe-notif');

			// if (dataRes) for (let i = 0; i < dataRes.response.length; i++) {}
			console.log(dataRes);
		}
		console.log(dataRes);
	});
}
