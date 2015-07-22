//requiring modules
var express = require('express'),
    app = express(),
    _ = require('underscore'),
    // cors = require('cors'),
    // ejs = require('ejs'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    // User = require('./models/user'),
    config = require('config'),
    session = require('express-session');


// serve js and css files from public folder
app.use(express.static(__dirname + '/public'));

// configure bodyParser (for handling data)
app.use(bodyParser.urlencoded({extended: true}));

//connecting to mongoDB of heroku or localhost
mongoose.connect(config.MONGO_URI);

// set/ configure session
app.use(session({
 saveUninitialized: true,
 resave: true,
 secret: config.SESSION_SECRET,
 cookie: { maxAge: 60000 }
}));

// require 'profile' model
var Profile = require('./models/profile'),
    Comment = require('./models/comment');

// STATIC ROUTES

// root (serves index.html)
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});


// API ROUTES       

// get all profiles 
app.get('/api/profiles', function (req, res) {
  // find all profiles in db
  Profile.find(function (err, profile) {
    if (err) {
      console.log("error: ", err);
      res.status(500).send(err);
    } else {
      res.json(profile);
    }
  });
});

// creat new profle
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
      console.log("error: ", err);
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
          console.log("error: ", err);
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
      console.log("error: ", err);
      res.status(500).send(err);
    } else {
      // send back deleted post
      res.json(deletedProfile);
    }
  });
});

// create new comment
app.post('/api/phrases/:phraseId/comments', function (req, res) {
  // create new note with form data (`req.body`)
  var newComment = new Comment({
    text: req.body.text
  });

  // set the value of the id
  var targetId = req.params.profileId;

  // find phrase in db by id
  Profile.findOne({_id: targetId}, function (err, foundProfile) {
    foundProfile.comments.push(newComment);
    foundProfile.save();
    res.json(newProfile);
  });
});

app.listen(config.PORT);
console.log('server started on locahost:3000');