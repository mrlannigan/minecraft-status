
/**
 * Module dependencies.
 */

var express = require('express'),
  passport = require('passport'),
  routes = require('./routes'),
  login = require('./routes/login'),
  http = require('http'),
  flash = require('connect-flash'),
  LocalStrategy = require('passport-local').Strategy,
  path = require('path');

var app = express();

var users = require('./users.json') || {};

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  done(null, users[id]);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    if (username in users && users[username].password === password) {
      return done(null, users[username]);
    } else {
      return done(null, false, { message: 'Incorrect password.' });
    }
  }
));

app.locals.title = 'Minecraft Status';

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/login', login.index);

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
