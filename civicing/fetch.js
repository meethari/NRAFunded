function saveReps(address){
	var newaddress = address.replace(/, /g, "%20");
	var newaddress = newaddress.replace(/ /g, "%20");
	console.log(newaddress);
	var req = new XMLHttpRequest();
	req.onload = function(event){
		console.log(event);
		console.log(req);
		console.log(JSON.stringify(req));
	}
	req.open('GET', "https://www.googleapis.com/civicinfo/v2/representatives?key=" + keyhere +"&address=" + newaddress, true);
	req.send();
}


saveReps('1263 Pacific Ave., Kansas City KS');