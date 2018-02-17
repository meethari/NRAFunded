$(window).on("load", function() {
    //Update Map
    updateMap();

    //Update General Statistics
    updateGeneralStats();

    $("#geolocateMe").click(function() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log("Latitude: " + position.coords.latitude);
                console.log("Longitude: " + position.coords.longitude);
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                reverseGeocode(latitude, longitude);
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    });

    $("#searchBarIcon").click(function() {
        var userInput = $("#searchBarInput").val();
        var newUserInput = userInput.replace(/, /g, "%20");
        newUserInput = newUserInput.replace(/ /g, "%20");
        console.log(newUserInput);
        geocode(newUserInput);
        $("#searchBarInput").val("");
    });

    $("#initialSearchBarIcon").click(function() {
        var userInput = $("#initialSearchBarInput").val();
        var newUserInput = userInput.replace(/, /g, "%20");
        newUserInput = newUserInput.replace(/ /g, "%20");
        console.log(newUserInput);
        geocode(newUserInput);
        $("#initialSearchBarInput").val("");
    });

    $("#initialSeachGeolocateMe").click(function() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log("Latitude: " + position.coords.latitude);
                console.log("Longitude: " + position.coords.longitude);
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                reverseGeocode(latitude, longitude);
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    });
});

// Geocode Function
// Accepts user inputted address
// Returns latitude and longitude
// Geocode
function geocode(input) {
    // Get latitude and longitude
    $.get('/getMapsAPIKey', function(apiKey) {
        var geocodeSource = "https://maps.googleapis.com/maps/api/geocode/json?address=" + input + "&key=" + apiKey;
        $.get(geocodeSource, function(data, status) {
            console.log(data);
            var latitude = data.results[0].geometry.location.lat;
            var longitude = data.results[0].geometry.location.lng;
            console.log(latitude);
            console.log(longitude);
            reverseGeocode(latitude, longitude);
        });
    });
}

// Reverse Geocode Function
// Accepts latitude and longitude
// Returns city, county, and state
function reverseGeocode(latitude, longitude) {
    $.get('/getMapsAPIKey', function(apiKey) {
        var reverseGeocodeSource = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + apiKey;
        $.get(reverseGeocodeSource, function(data) {
            console.log(data);
            var lat = latitude;
            var lng = longitude;
            var adminOne = "";
            var adminTwo = "";
            var locality = "";
            for(var i = 0; i < data.results[0].address_components.length; i++) {
                if(data.results[0].address_components[i].types[0] == "administrative_area_level_1") {
                    adminOne = data.results[0].address_components[i].long_name;
                } else if(data.results[0].address_components[i].types[0] == "administrative_area_level_2") {
                    adminTwo = data.results[0].address_components[i].long_name;
                } else if(data.results[0].address_components[i].types[0] == "locality") {
                    locality = data.results[0].address_components[i].long_name;
                }
            }
            console.log("Latitude: " + lat);
            console.log("Longitude: " + lng);
            console.log("AdminOne: " + adminOne);
            console.log("AdminTwo: " + adminTwo);
            console.log("Locality: " + locality);
            $.post('/updateCurrentSearchParameters', {
                longitude: lng,
                latitude: lat,
                adminLevelOne: adminOne,
                adminLevelTwo: adminTwo,
                locality: locality
            });
            if(document.getElementById('map') != null) {
                initMap();
                window.location.assign('/index');
            } else {
                window.location.assign('/index');
            }
        });
    });
}

// Initialize Map: Method for initializing and updating the embedded map
var map;
function initMap() {
    $.get('/getCurrentSearchParameters', function(location) {
        console.log(location);
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: parseFloat(location.lat), lng: parseFloat(location.lng)},
          zoom: 13
        });
    });
}

// Update map
function updateMap() {
    $.get('/getMapsAPIKey', function(apiKey) {
        var source = "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&callback=initMap";
        $("#mapSource").attr("src", source);
    });
}

// Update general stats
function updateGeneralStats() {
    $.get('/getCurrentSearchParameters', function(location) {
        var locationName = "";
        if (location.locality != "") {
            locationName += location.locality;
        }
        if (location.adminTwo != "") {
            locationName += ", " + location.adminTwo;
        }
        if (location.adminOne != "") {
            locationName += ", " + location.adminOne;
        }
        $("#generalStatsLocation").html(locationName);
    });
}