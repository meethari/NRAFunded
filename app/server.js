// Define required packages
// Import express.js
var express = require("express");
// Import firebase
var admin = require('firebase-admin');
// Import configurations
var config = require("./config.js");
// Import body-parser
var bodyParser = require("body-parser");

// Import service account
//var serviceAccount = require('./serviceAccountKey.json');

// Initialize express.js app
var app = express();

//Configure body-parser
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({ type: 'application/*+json', limit: '50mb' }));

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
// Define a route for initial search page
app.use(require('./routes/initialSearch'));

// Define port to serve the application
app.set('port', process.env.PORT || 3000 );

// Local Variables
// Set initial values to correspond to Washington DC
// Longitude
app.locals.longitude = -77.0374887;
// Latitude
app.locals.latitude = 38.906159;
// Administrative Level 1: State
app.locals.adminLevelOne = "District of Columbia";
// Administrative Level 2: County
app.locals.adminLevelTwo = "";
// Locality: City
app.locals.locality = "Washington";

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

// Post request to update current search parameters
app.post('/updateCurrentSearchParameters', function(req, res) {
    app.locals.longitude = req.body.longitude;
    app.locals.latitude = req.body.latitude;
    app.locals.adminLevelOne = req.body.adminLevelOne;
    app.locals.adminLevelTwo = req.body.adminLevelTwo;
    app.locals.locality = req.body.locality;
    console.log("Updating current search parameters");
});

// Get request to get current search parameters
app.get('/getCurrentSearchParameters', function(req, res) {
  var location = {
    lng: app.locals.longitude,
    lat: app.locals.latitude,
    adminOne: app.locals.adminLevelOne,
    adminTwo: app.locals.adminLevelTwo,
    locality: app.locals.locality
  }
  res.send(location);
});