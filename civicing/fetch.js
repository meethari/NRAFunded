function saveDistrict(){
	var keypath = "C:\Users\Kevin Zheng\Documents\Grade 0\HopHack\apee.txt";
	// next line definitely does not work, cannot just append keypath to the url for sure, need the actual .txt contents
	var electionList = httpGET("https://www.googleapis.com/civicinfo/v2/elections?key=" + "AIzaSyAz550WPKsfNScg8he4Zdw57EVDwfjfAgE");
	return electionList;
}

saveDistrict()