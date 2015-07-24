//requiring modules
var express = require('express'),
    app = express(),
    // _ = require('underscore'),
    // cors = require('cors'),
    // ejs = require('ejs'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    User = require('./models/user'),
    // config = require('./config'),
    session = require('express-session'),
    Profile = require('./models/profile'),
    Comment = require('./models/comment');

//connecting to mongoDB of heroku or localhost
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || require('./config').MONGO_URI);

// middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));



// setting view engine to render html files

app.set('views', __dirname + '/public');
//app.set('view engine', 'ejs');

// set session option
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'SuperSecretCookie',
  cookie: { maxAge: 60000 }
}));

app.use('/', function (req, res, next) {
  // saves userId in session for logged-in user
  req.login = function (user) {
    req.session.userId = user.id;
  };

  // finds user currently logged in based on `session.userId`
  req.currentUser = function (callback) {
    User.findOne({_id: req.session.userId}, function (err, user) {
      req.user = user;
      callback(null, user);
    });
  };

  // destroy `session.userId` to log out user
  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  };

  next();
});

// AUTHORIZATION

// signup route (renders signup view)
app.get('/signup', function (req, res) {
 res.sendFile(__dirname + '/public/views/signup.html');
});

// user submits the signup form
app.post('/users', function (req, res) {

 // grab user data from params (req.body)
 //var newUser = req.body.user;
var email = req.body.email;
var password = req.body.password;
 // create new user with secure password
 User.createSecure( email, password, function (err, user) {
   //req.login(user);
   res.redirect('/login');
 });
});

// AUTHENTICATION

// user submits the login form
app.post('/login', function (req, res) {
  //console.log('post');
  // grab user data from params (req.body)
  var userData = req.body.user;
  console.log(userData);

  // call authenticate function to check if password user entered is correct
  User.authenticate(userData.email, userData.password, function (err, user) {
  // saves user id to session
  req.login(user);
  res.redirect('/')

  });
});

// user profile page
app.get('/index', function (req, res) {
 // finds user currently logged in
  req.currentUser(function (err, user) {
    res.send('Welcome ' + user.email);
  });
});

app.get('/logout', function(req, res) {
 req.logout();
 res.redirect('/profile');
});

// login route (renders login view)
app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/public/views/login.html');
});




// STATIC ROUTES

// homepage
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

// home page

// profile page
app.get('/profile', function (req, res) {
  // check for current (logged-in) user
  req.currentUser(function (err, user) {
    // show profile if logged-in user
    if (user) {
      res.sendFile(__dirname + '/public/views/profile.html');
    // redirect if no user logged in
    } else {
      res.redirect('/');
    }
  });
});


// API ROUTES

// get all user personality profiles 
app.get('/api/profiles', function (req, res) {
  // find all profiles in db
  Profile.find(function (err, profile) {
    if (err) {
      console.log("error: ", err);
      res.status(500).send(err);
    } else {
      res.send(profile);
    }
  });
});

// create new profle
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

//connecting it to the server or port 3000
app.listen(process.env.PORT || require('./config').PORT, function(){
 console.log('server started on locahost:3000');
});