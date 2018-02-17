// inputs an address and asks google civic api for local officials

function saveReps(address){
	var config = require('C:\\Users\\Kevin Zheng\\Documents\\Grade 0\\HopHack\\apee.json');
	var reps;
	var newaddress = changeaddress(address);
	console.log(newaddress);
	$.get("https://www.googleapis.com/civicinfo/v2/representatives?key=" + config.apikey + "&address=" + newaddress, function(data, status){
		// the data variable holds the information you seek
		console.log(status);
		console.log(data);
        reps = data;
        $("#text-field").text(data.officials[1].name);
	});
	console.log(reps);
	return reps;
}

function saveElections(){
	var config = require('C:\\Users\\Kevin Zheng\\Documents\\Grade 0\\HopHack\\apee.json');/
	var elections;
	$.get("https://www.googleapis.com/civicinfo/v2/elections?key=" + config.apikey, function(data, status){
		console.log(status);
		console.log(data);
		elections = data;
	});
	return elections;
}

function saveOneElection(address, electionId){
	var config = require('C:\\Users\\Kevin Zheng\\Documents\\Grade 0\\HopHack\\apee.json');/
	var newaddress = changeaddress(address);
	var oneElection;
	$.get("https://www.googleapis.com/civicinfo/v2/voterinfo?key=" + config.apikey +"&address=" + newaddress + "&electionId=" + electionId , function(data, status){
		console.log(status);
		console.log(data);
		oneElection = data;
	});
	return oneElection;
}

function changeaddress(address){
	var newaddress = address.replace(/, /g, "%20");
	var newaddress = newaddress.replace(/ /g, "%20");
	return newaddress;
}

// still have to work on successfully returning the data from the functions
//var elections = saveElections();
//var kansasReps = saveReps('1263 Pacific Ave., Kansas City, KS');
//var swatReps = saveReps('500 College Ave, Swarthmore, PA');
//var oneElection = saveOneElection('500 College Ave, Swarthmore, PA', 2000);
var latlong = saveReps('39.906841, -75.355648');
//console.log(elections);
//console.log(kansasReps);
//console.log(swatReps);
console.log(latlong);