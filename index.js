'use strict';

var app = require('app');
var browserWindow = require('browser-window');
var settings = require('./app/settings');

require('crash-reporter').start();

var mainWindow = null;

var twitterAPI = require('node-twitter-api');

var twitter = new twitterAPI({
  consumerKey: settings.TWITTER_CONSUMER_KEY,
  consumerSecret: settings.TWITTER_CONSUMER_SECRET,
  callback: 'http://tmegos.hatenablog.jp' // 別にどこでもよい
});


twitter.getRequestToken(function(error, requestToken, requestTokenSecret) {
  var url = twitter.getAuthUrl(requestToken);
  var loginWindow = new browserWindow({width: 800, height: 600});
  loginWindow.webContents.on('will-navigate', function (event, url) {
  	console.log(url);
    // https://www.google.co.jp/?oauth_token=...&oauth_verifier=...のようなURLが渡ってくる.
    var matched;
    if(matched = url.match(/\?oauth_token=([^&]*)&oauth_verifier=([^&]*)/)) {
      twitter.getAccessToken(requestToken, requestTokenSecret, matched[2], function(error, accessToken, accessTokenSecret){
        console.log('accessToken', accessToken);
        console.log('accessTokenSecret', accessTokenSecret);
      });
    }
    event.preventDefault();
    loginWindow.close();
  });
  loginWindow.loadUrl(url);
});

app.on('window-all-closed', function() {
	if (process.platform != 'darwin') {
		app.quit();
	}
});

app.on('ready', function() {
	mainWindow = new browserWindow({width: 300, height: 500});
	mainWindow.loadUrl('file://' + __dirname + '/index.html');

	mainWindow.on('closed', function() {
		mainWindow = null;
	})
})