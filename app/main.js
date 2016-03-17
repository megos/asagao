var remote = require('remote');
var BrowserWindow = remote.require('browser-window');
var Twitter = require('twitter');
var TwitterAuth = require('./app/auth');
var Vue = require('vue');
var moment = require('moment');
var Autolinker = require('autolinker');
var settings = require('./app/settings');
var Client = require('./app/client');
var Timeline = require('./app/timeline');
var Parser = require('./app/parser');
var accessTokenKey = '';
var accessTokenSecret = '';
var client = '';

// 初期設定
moment.locale('ja');
var autolinker = new Autolinker({twitter: true, hashtag: 'twitter'});


if (!localStorage.getItem('auth')) {
	var twitterAuth = new TwitterAuth(settings.TWITTER_CONSUMER_KEY, settings.TWITTER_CONSUMER_SECRET);
	twitterAuth.getTwitterAuth();
}

var auth = JSON.parse(localStorage.getItem('auth'));
accessTokenKey = auth.accessTokenKey;
accessTokenSecret = auth.accessTokenSecret;
console.log(auth);
client = new Client(settings.TWITTER_CONSUMER_KEY,
					settings.TWITTER_CONSUMER_SECRET,
					accessTokenKey,
					accessTokenSecret);
console.log(client);
twitterClient = client.getClient();

timeline = new Timeline(twitterClient);
var parser = new Parser();



var shell = require('shell');
var webview = document.getElementById('main');

webview.addEventListener('new-window', function(e){
	console.log(e);
    shell.openExternal(e.url);
});