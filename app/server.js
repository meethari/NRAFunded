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
var serviceAccount = require('./serviceAccountKey.json');

// Initialize express.js app
var app = express();

//Configure body-parser
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({ type: 'application/*+json', limit: '50mb' }));

// Initialize firebase app

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nrafunded-55558.firebaseio.com"
});


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
// Define a route for the splash page
app.use(require('./routes/splash'));

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
var db = admin.database();

// Serve the application
var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});

// Get request for maps API key
app.get('/getAPIKey', function(req, res) {
    res.send(config.APIKey);
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

function standardizeName(name){
  var firstName;
  var lastName;
  var i;
  for (i = 0; i < name.length && name.charAt(i) !== " "; i++){
  }
  firstName = name.substring(0, i);
  if (i === name.length){
    lastName = "";
  }
  else{
    for (i = name.length - 1; i >= 0 && name.charAt(i) !== " "; i--){
    }
    lastName = name.substring(i, name.length);
  }
  return firstName + lastName;
}

function pullLastName (name){
  var firstName;
  var lastName;
  var i;
  for (i = 0; i < name.length && name.charAt(i) !== " "; i++){
  }
  firstName = name.substring(0, i);
  if (i === name.length){
    lastName = "";
  }
  else{
    for (i = name.length - 1; i >= 0 && name.charAt(i) !== " "; i--){
    }
    lastName = name.substring(i, name.length);
  }
  return lastName;
}

function findMatch(name, state, table)
{
  var match;
  var id = 0
  var flag = 0;

  for (id = 0; id < table.length; id++) {
    // console.log(table[id].name + " " + name + " " + id);
    if (table[id].name === name)
    {
      flag = 1;
      break;
    }
  }

  if (flag != 1)
  {
    std_name = standardizeName(name);
    for (id = 0; id < table.length; id++) {
      if (standardizeName(table[id].name) === name)
      {
        flag = 1;
        break;
      }
    }
  }

  if (flag != 1)
  {
    lastName = pullLastName(name);
    for (id = 0; id < table.length; id++)
    {
      if (pullLastName(table[id].name) === lastName && table[id].state === state)
      {
        flag = 1;
        break;
      }
    }
  }

  if (flag == 0)
    return -1;
  else {
    return id;
  }

}

app.post('/getGeneralData', function(req, res) {
  var arrayOfOfficials = req.body.officials;
  console.log(arrayOfOfficials);
  var civicState = app.locals.adminLevelOne;
  var ref = db.ref("Federal/Officials");
  ref.on("value", function(snapshot) {
    var total = 0;
    var peopleFunded = 0;
    var highestFunded = 0;
    for(var i = 0; i < arrayOfOfficials.length; i++) {
      var row = findMatch(arrayOfOfficials[i].name, civicState, snapshot.val());
      if(row >= 0) {
        if(snapshot.val()[row].money > 0) {
          peopleFunded++;
        }
        if(snapshot.val()[row].money > highestFunded) {
          highestFunded = snapshot.val()[row].money;
        }
        total += snapshot.val()[row].money;
      }
    }
    res.send({
      totalFunds: total,
      totalPeopleFunded: peopleFunded,
      highestFunded: highestFunded
    });
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});

app.post('/queryDatabase', function(req, res) {
  var civicName = req.body.name;
  var civicState = app.locals.adminLevelOne;
  var civicPosition = req.body.position;
  var civicParty = req.body.party;
  console.log(civicPosition);
  console.log(civicState);
  console.log(civicName);
  var ref = db.ref("Federal/Officials");
  ref.on("value", function(snapshot) {
    var row = findMatch(civicName, civicState, snapshot.val());
    console.log(row);
    if(row >= 0) {
      console.log(snapshot.val()[row]);
      res.send({
        name: civicName,
        party: civicParty,
        position: civicPosition,
        money: snapshot.val()[row].money
      });
    } else {
      res.send({
        name: civicName,
        party: civicParty,
        position: civicPosition,
        money: 0
      });
    }
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});