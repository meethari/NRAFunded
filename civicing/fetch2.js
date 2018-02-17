// inputs an address and asks google civic api for local officials
// this one requests local representatives based on an address, and stores it in the "data" field
// apikey not working right now cuz I can't use require
function saveReps(address){
	var config = "AIzaSyDL4fVkLF6vdgzjt4C0XApfOmaH2Fciyok";
	var newaddress = changeaddress(address);
	console.log(newaddress);
	$.get("https://www.googleapis.com/civicinfo/v2/representatives?key=" + config + "&address=" + newaddress, function(data, status){
		// the data variable holds the information you seek
		console.log(status);
		console.log(data);
	});
}

// this one requests all elections that can be queried at the time.
// each election has a unique ID number that can be used in the next function to find more details
function saveElections(){
	var config = ;
	$.get("https://www.googleapis.com/civicinfo/v2/elections?key=" + config, function(data, status){
		console.log(status);
		console.log(data);
	});
}

// takes an address and election ID number to find more detailed information about a specific election
function saveOneElection(address, electionId){
	var config = ;
	var newaddress = changeaddress(address);
	$.get("https://www.googleapis.com/civicinfo/v2/voterinfo?key=" + config +"&address=" + newaddress + "&electionId=" + electionId , function(data, status){
		console.log(status);
		console.log(data);
	});
}

// basic parsing
function changeaddress(address){
	var newaddress = address.replace(/, /g, "%20");
	var newaddress = newaddress.replace(/ /g, "%20");
	return newaddress;
}

// lots of testing happening down there

// still have to work on successfully returning the data from the functions
saveElections();
saveReps('1263 Pacific Ave., Kansas City, KS');
saveOneElection('500 College Ave, Swarthmore, PA', 2000);
saveReps('37.968056, -77.746667');
