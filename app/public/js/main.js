

$(document).ready(function() {
    // Geolocate function
    $("#geolocateMe").click(function() {
        console.log("Geolocate");
        getLocation();
    });

    updateMap();
});

//getLocation function
function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude);
    console.log("Longitude: " + position.coords.longitude);
}

//Initializing map
function updateMap() {
    $.get('/getMapsAPIKey', function(apiKey) {
        var source = "https://www.google.com/maps/embed/v1/place?key=" + apiKey + "&q=Space+Needle,Seattle+WA";
        $("#map iframe").attr("src", source);
    });
}