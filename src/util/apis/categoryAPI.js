export const fetchAllCategories = (accessToken) => {
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	fetch(global.config.apiURL + '/products/categories', {
		method: 'GET',
		headers: {
			'x-auth-token': accessToken,
		},
	}).then((response) => {
		response.json().then((json) => {
			let arr = [];
			for(let i = 0; i < json.length; i++) {
				let c = json[i].toUpperCase();
				if(!arr.includes(c)) {
					arr.push(c);
				}
			}
			arr.sort();
			arr = ["ALL", ...arr];
			if(response.ok) {
				promiseResolveRef({
					data: arr,
					response: response,
				});
			} else {
				promiseRejectRef({
					reason: "Server error occurred.",
					response: response,
				});
			}
		});
	}).catch((err) => {
		promiseRejectRef({
			reason: "Some error occurred.",
			response: err,
		});
	});
	return promise;
};