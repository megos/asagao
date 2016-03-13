var remote = require('remote');
var BrowserWindow = remote.require('browser-window');
var storage = require('electron-json-storage');
var Twitter = require('twitter');
var Vue = require('vue');
var moment = require('moment');
var settings = require('./app/settings');
var accessTokenKey = '';
var accessTokenSecret = '';
var client = '';

// 初期設定
moment.locale('ja');

storage.get('auth', function(error, data) {
	if (error) throw error;

	if (Object.keys(data).length === 0) {
		// TODO: エラー処理
	} else {
		console.log(data);
		accessTokenKey = data['accessTokenKey'];
		accessTokenSecret = data['accessTokenSecret'];
		client = new Client(settings.TWITTER_CONSUMER_KEY,
							settings.TWITTER_CONSUMER_SECRET,
							accessTokenKey,
							accessTokenSecret);
		twitterClient = client.getClient();

		timeline = new Timeline(twitterClient);
		
		timeline.getTimeline();
	}
});