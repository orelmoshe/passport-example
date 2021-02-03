var path = require('path');
const express = require('express');
const session = require("express-session");
const bodyParser = require("body-parser");

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(session({ secret: "mySecretKey" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  console.log('In serializeUser');
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log('In deserializeUser');
  User.findById(id, function (err, user) {
    console.log('>Found user ? ', user);
    done(err, user);
  });
});

passport.use(new LocalStrategy((username, password, done) => {
  console.log('In LocalStrategy');
  User.findOne({ username: username }, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
}));

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

// routes
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, './public/login.html'));
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.send('Successful passport check!');
});

app.get('/logout', (req, res) => {
  console.log('user logout ? ', req.user);
  req.logout();
  res.redirect('/login');
});

// protected route, if you are not logged in redirects you to login. 
app.get('/protected_route', isAuthenticated, (req, res) => res.send('Hello to protected route!'));

// unprotected route
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));