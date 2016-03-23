var remote = require('remote');
var BrowserWindow = remote.require('browser-window');
var Vue = require('vue');
var settings = require('../app/settings');
var Client = require('../app/client');
var TwitterManager = require('../app/twitter-manager');
var Parser = require('../app/parser');

var auth = JSON.parse(localStorage.getItem('auth'));
var userId = localStorage.getItem('userId');

var client = new Client(settings.TWITTER_CONSUMER_KEY,
                    settings.TWITTER_CONSUMER_SECRET,
                    auth.accessTokenKey,
                    auth.accessTokenSecret);

var twitterClient = client.getClient();

var twitterManager = new TwitterManager(twitterClient);
var parser = new Parser();

var tweetComponent = Vue.extend({
  props: ['tweet'],
  template: '#tweet-component',
  methods: {

    setReply: function(userId, tweetId, event) {
      console.log(userId + ' ' + tweetId);
    },

    openImageWindow: function(url, height, width, event) {
      // TODO: マジックナンバーをどうにかする
      var titleBarHeight = 22;
      var imageWindow = new BrowserWindow({
        height: height + titleBarHeight,
        width: width
      });
      imageWindow.loadURL(url);
      imageWindow.on('closed', function() {
        imageWindow = null;
      });
    }
  }
});
Vue.component('timeline-home', tweetComponent);
Vue.component('timeline-mentions', tweetComponent);

var timelineVue = new Vue({
  el: '#main',
  data: {
    tweets: [],
    mentions: [],
    tweettext: ''
  },
  created: function() {
    var self = this;
    twitterManager.getUserInfo(userId, function(){});
    twitterManager.getTimeline(function(tweetsRow) {
      for (var i = 0; i < tweetsRow.length; i++) {
        self.tweets.push(parser.tweetParse(tweetsRow[i]));
      }
      console.log(self.tweets);
    });

    twitterManager.getUserStream(function(data) {
      console.log(data);
      if (data.created_at != null && data.text != null) {
        for (var i = 0; i < self.tweets.length; i++) {
          self.tweets[i] = parser.setRelativeCreatedAt(self.tweets[i]);
        }
        self.tweets.unshift(parser.tweetParse(data));
      } else if (data.delete != null) {
        console.log(data);
        for (var i = 0; i < self.tweets.length; i++) {
          // 削除tweet id確認
          if ((self.tweets[i].id == data.delete.status.id) && (self.tweets[i].user.id == data.delete.status.user_id)) {
            self.tweets.splice(i, 1);
          }
        }
      }
    });

    twitterManager.getMentionsTimeline(function(tweetsRow) {
      for (var i = 0; i < tweetsRow.length; i++) {
        self.mentions.push(parser.tweetParse(tweetsRow[i]));
      }
    });
  },
  methods: {
    tweet: function(event) {
      var self = this;
      twitterManager.postTweet(this.tweettext, function(callback) {
        self.tweettext = '';
      });
    }
  }
});