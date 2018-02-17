// Define required packages
// Import express.js
var express = require("express");
// Import firebase
var admin = require('firebase-admin');
// Import configurations
var config = require("./config.js");
// Import service account
//var serviceAccount = require('./serviceAccountKey.json');

// Initialize express.js app
var app = express();
// Initialize firebase app
/*
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nrafunded-55558.firebaseio.com"
});
*/

// Define the view engine: EJS
// EJS: Effective JavaScript (Templating language)
app.set('view engine', 'ejs');
// Define where the views are located: Front-end
app.set('views', 'views');

// Define where static files are located: CSS, JS
app.use(express.static('public'));

// Route definitions:
// Define a route for the index page
app.use(require('./routes/index'));

// Define port to serve the application
app.set('port', process.env.PORT || 3000 );

// Local Variables
// Longitude
app.locals.longitude;
// Latitude
app.locals.latitude;
// Administrative Level 1: State
app.locals.adminLevelOne;
// Administrative Level 2: County
app.locals.adminLevelTwo;
// Locality: City
app.locals.locality;

// Initialize database
//var db = admin.database();

// Serve the application
var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});

/*
var ref = db.ref("/");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});
*/

// Get request for maps API key
app.get('/getMapsAPIKey', function(req, res) {
    res.send(config.MapsAPIKey);
});