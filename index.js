'use strict';

var TWITTER_CONSUMER_KEY = '';
var TWITTER_CONSUMER_SECRET = '';

var frontApp = require('app');
var browserWindow = require('browser-window');
var express = require('express');
var backApp = express();
var passport = require('passport');
var passportTwitter = require('passport-twitter');
var twitterStrategy = passportTwitter.Strategy;

require('crash-reporter').start();


passport.serializeUser(function (user, done) {
    done(null, user);
});
 
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

backApp.use(passport.initialize());
backApp.use(passport.session());
backApp.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

passport.use(new twitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
  	console.log(token);
  	console.log(tokenSecret);
  	console.log(profile);
    process.nextTick(function() {
    	return done(null, profile);
    });
  }
));

// 認証のために Twitter へリダイレクトさせます。認証が完了すると、Twitter は
// ユーザーをアプリケーションへとリダイレクトして戻します。
//   /auth/twitter/callback
backApp.get('/auth/twitter', passport.authenticate('twitter'));

// ユーザーが許可すると、Twitter はユーザーをこの URL にリダイレクトさせます。
// この認証プロセスの最後に、アクセストークンの取得をおこないます。
// この取得が成功すればユーザーはログインしたことになります。取得に失敗したとき
// は、認証が失敗したとみなされます。
backApp.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));

backApp.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
})

backApp.use('/node_modules', express.static(__dirname + '/node_modules'));

backApp.listen(3000);

var mainWindow = null;

frontApp.on('window-all-closed', function() {
	if (process.platform != 'darwin') {
		app.quit();
	}
});

frontApp.on('ready', function() {
	mainWindow = new browserWindow({width: 300, height: 500});
	mainWindow.loadUrl('http://127.0.0.1:3000');

	mainWindow.on('closed', function() {
		mainWindow = null;
	})
})