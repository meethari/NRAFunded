$(window).on("load", function() {
    //Update Map
    updateMap();

    // Geolocate function
    $("#geolocateMe").click(function() {
        console.log("Geolocate");
        getLocation();
    });

    // Geolocate with address
    $("#searchBarIcon").click(function() {
        console.log("Geolocating with address");
        geocodeUserInput($("#searchBarInput").val());
    });
});

//getLocation function
function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPositionWithPositionObject);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}
function showPositionWithPositionObject(position) {
    console.log("Latitude: " + position.coords.latitude);
    console.log("Longitude: " + position.coords.longitude);
    //Update Map Position
    initMap(position.coords.latitude, position.coords.longitude);
    //Update General Stats
    reverseGeocode(position.coords.latitude, position.coords.longitude);
}

function showPositionWithLatLng(latitude, longitude) {
    console.log("Latitude: " + latitude);
    console.log("Longitude: " + longitude);
    //Update Map Position
    initMap(latitude, longitude);
    //Update General Stats
    reverseGeocode(latitude, longitude);
}

// Initialize Map
var map;
function initMap(latitude = 38.8937091, longitude = -77.084616, frame = 13) {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: latitude, lng: longitude},
      zoom: frame
    });
}

// Update map
function updateMap() {
    $.get('/getMapsAPIKey', function(apiKey) {
        var source = "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&callback=initMap";
        $("#mapSource").attr("src", source);
    });
}

// Reverse Geocode
function reverseGeocode(latitude, longitude) {
    $.get('/getMapsAPIKey', function(apiKey) {
        var reverseGeocodeSource = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + apiKey;
        $.get(reverseGeocodeSource, function(data) {
            console.log(data);
        });
    });
}

// Geocode
function geocodeUserInput(userInput) {
    var newUserInput = userInput.replace(/, /g, "%20");
    newUserInput = newUserInput.replace(/ /g, "%20");
    console.log(newUserInput);
    // Get latitude and longitude
    $.get('/getMapsAPIKey', function(apiKey) {
        var geocodeSource = "https://maps.googleapis.com/maps/api/geocode/json?address=" + newUserInput + "&key=" + apiKey;
        $.get(geocodeSource, function(data, status) {
            console.log(data);
            console.log("Latitude: " + data.results[0].geometry.location.lat);
            console.log("Longitude: " + data.results[0].geometry.location.lng);
            showPositionWithLatLng(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng)
        });
    });
}