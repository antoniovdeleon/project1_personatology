//requiring modules
var express = require('express'),
    app = express(),
    _ = require('underscore'),
    // cors = require('cors'),
    // ejs = require('ejs'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    // User = require('./models/user'),
  session = require('express-session');

//connecting to mongoDB of heroku or localhost
mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL 
  || 'mongodb://localhost/profiles');


//setting up models
// var User = require('./models/user');
var Profile = require('./models/profile');


//middleware
// app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));


// setting view engine to render html files
// app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');


// set session options
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'SuperSecretCookie',
  cookie: { maxAge: 60000 }
}));

//static Routes
app.use(express.static(__dirname + '/public/views'));


//ROUTES

// //signup routes
// app.get('/signup', function (req, res){
//   res.send('coming');
// });

//serving index.html
app.get('/', function(req, res) {
  res.sendFile= __dirname + "/public/views/index.html";
});

//get all the bands from the db
app.get('/api/profiles', function (req, res) {
  // find all foods in db
  Profile.find(function (err, profile) {
    res.json(profile);
  });
});

// POST NEW EVENT
app.post('/api/profiles', function(req, res) {
 // create new instance of profile
	var newProfile = new Profile({
		type: req.body.type,
		name: req.body.name,
		age: req.body.age,
		hobbies: req.body.hobbies,
		careerAspire: req.body.careerAspire,
		jobs: req.body.jobs,
		weakness: req.body.weakness
 });
  // save new log in db
  newProfile.save(function (err, savedProfile) {
    res.json(savedProfile);
  });
});

// GET A SINGLE POST 
app.get('/api/profiles/:id', function(req, res) {
  // take the value of the id from the url parameter
  // note that now we are NOT using parseInt
  var targetId = req.params.id

  // find item in database matching the id
  Profile.findOne({_id: targetId}, function(err, foundProfile){
    console.log(foundProfile);
    if(err){
      console.log("error: ", err);
      res.status(500).send(err);
    } else {
      // send back post object
      res.json(foundProfile);
    }
  });
});

// EDIT A SINGLE POST
app.put('/api/profiles/:id', function (req, res) {
  // take the value of the id from the url parameter
  var targetId = req.params.id;
  // find item in `posts` array matching the id
  Profile.findOne({_id: targetId}, function (err, foundProfile){
    console.log(foundProfile); 
    if(err){
      res.status(500).send(err);
    } else {
      foundProfile.type = req.body.type;
      foundProfile.name = req.body.name;
      foundProfile.age = req.body.Age;
      foundProfile.hobbies = req.body.hobbies;
      foundProfile.careerAspire = req.body.careerAspire;
      foundProfile.jobs = req.body.jobs;
      foundProfile.weakness = req.body.weakness;
      //save changes
      foundProfile.save(function (err, savedProfile){
        if (err){
          res.status(500).send(err);
        } else {
          // send back edited object
          res.json(savedProfile);
        }
      });
    }
  });
});

// DELETE POST
app.delete('/api/profiles/:id', function(req, res) {

  var targetId = req.params.id;

 // remove item from the db that matches the id
   Profile.findOneAndRemove({_id: targetId}, function (err, deletedProfile) {
    if (err){
      res.status(500).send(err);
    } else {
      // send back deleted post
      res.json(deletedProfile);
    }
  });
});

//connecting it to the server or port 3000
app.listen(process.env.PORT || 3000);
console.log('server started on locahost:3000');
