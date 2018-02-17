// Define required packages
// Import express.js
var express = require("express");

// Initialize express.js app
var app = express();

//Define the view engine: EJS
//EJS: Effective JavaScript (Templating language)
app.set('view engine', 'ejs');
//Define where the views are located: Front-end
app.set('views', 'views');

//Define where static files are located: CSS, JS
app.use(express.static('public'));

//Route definitions:
//Define a route for the index page
app.use(require('./routes/index'));

//Define port to serve the application
app.set('port', process.env.PORT || 3000 );

//Serve the application
var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});
