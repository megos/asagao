var remote = require('remote');
var BrowserWindow = remote.require('browser-window');
var Vue = require('vue');
var settings = require('../app/settings');
var Client = require('../app/client');
var Timeline = require('../app/timeline');
var Parser = require('../app/parser');

var auth = JSON.parse(localStorage.getItem('auth'));

var client = new Client(settings.TWITTER_CONSUMER_KEY,
                    settings.TWITTER_CONSUMER_SECRET,
                    auth.accessTokenKey,
                    auth.accessTokenSecret);

var twitterClient = client.getClient();

var timeline = new Timeline(twitterClient);
var parser = new Parser();