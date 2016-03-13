var remote = require('remote');
var BrowserWindow = remote.require('browser-window');
var storage = require('electron-json-storage');
var Twitter = require('twitter');
var settings = require('./app/settings');
var accessTokenKey = '';
var accessTokenSecret = '';

storage.get('auth', function(error, data) {
	if (error) throw error;

	if (Object.keys(data).length === 0) {
		// TODO: エラー処理
	} else {
		console.log(data);
		accessTokenKey = data['accessTokenKey'];
		accessTokenSecret = data['accessTokenSecret'];
	}
});
var client = new Twitter({
  consumer_key: settings.TWITTER_CONSUMER_KEY,
  consumer_secret: settings.TWITTER_CONSUMER_SECRET,
  access_token_key: accessTokenKey,
  access_token_secret: accessTokenSecret
});

console.log(client);

var vue = new Vue({
	el: '#timeline',
	data: {
		tweets: [],
	},
	created: function() {
		var self = this;
		client.stream('statuses/home_timeline', function(error, tweets, response){

		  if (!error) {
		  	self.tweets = tweets;
		  	// for (var i = 0; i < tweets.length; i++) {
		  	// 	console.log(tweets[i]);
		  	// 	self.tweets.push(tweets[i]);
		  	// }
		  } else {
		  	console.log(error);
		  }
		});
	}
})