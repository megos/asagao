var remote = require('remote');
var BrowserWindow = remote.require('browser-window');
var Vue = require('vue');
var settings = require('../app/settings');
var Client = require('../app/client');
var Timeline = require('../app/timeline');
var Parser = require('../app/parser');
var accessTokenKey = '';
var accessTokenSecret = '';
var client = '';

var auth = JSON.parse(localStorage.getItem('auth'));
accessTokenKey = auth.accessTokenKey;
accessTokenSecret = auth.accessTokenSecret;
console.log(auth);
client = new Client(settings.TWITTER_CONSUMER_KEY,
                    settings.TWITTER_CONSUMER_SECRET,
                    accessTokenKey,
                    accessTokenSecret);
console.log(client);
var twitterClient = client.getClient();

var timeline = new Timeline(twitterClient);
var parser = new Parser();