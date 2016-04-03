var remote = require('remote');
var dialog = remote.require('dialog');
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
  props: ['tweet', 'user'],
  template: '#tweet-component',
  methods: {
    // TODO: componentからbindできないか
    setReply: function(screenName, tweetId) {
      timelineVue.setReply(screenName, tweetId);
    },

    setFavorite: function(tweetId, flg) {
      var self = this;
      // ふぁぼる
      if (flg) {
        twitterManager.createFavorite(tweetId, function(response) {
          if (response) {
            self.tweet.favorited = true;
          }
        });
      // ふぁぼを取り消す
      } else {
        twitterManager.destroyFavorite(tweetId, function(response) {
          if (response) {
            self.tweet.favorited = false;
          }
        });
      }
    },

    deleteTweet: function(tweetId) {
      var curWindow = remote.getCurrentWindow();
      var options = {
        type: 'info',
        buttons: ['Yes', 'No'],
        message: 'ツイートを削除してもよろしいですか'
      };
      dialog.showMessageBox(curWindow, options, function(callback) {
        // yes: 0, no: 1
        if (callback === 0) {
          twitterManager.deleteTweet(tweetId);
        }
      });
    },

    openImageWindow: function(url, height, width) {
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
    user: [],
    tweets: [],
    mentions: [],
    tweettext: '',
    replyScreenName: '',
    inReplyToStatusId: ''
  },
  created: function() {
    var self = this;
    twitterManager.getUserInfo(userId, function(user){
      self.user = user;
    });

    twitterManager.getTimeline(function(tweetsRow) {
      for (var i = 0; i < tweetsRow.length; i++) {
        self.tweets.push(parser.tweetParse(tweetsRow[i]));
      }
    });

    twitterManager.getUserStream(function(data) {
      if (data.created_at != null && data.text != null) {
        for (var i = 0; i < self.tweets.length; i++) {
          self.tweets[i] = parser.setRelativeCreatedAt(self.tweets[i]);
        }

        self.tweets.unshift(parser.tweetParse(data));

        if (data.text.indexOf('@' + self.user.screen_name) !== -1) {
          self.mentions.unshift(parser.tweetParse(data));
        }

      } else if (data.delete != null) {
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
      twitterManager.postTweet(this.tweettext, this.replyScreenName, this.inReplyToStatusId, function(callback) {
        self.tweettext = '';
        self.replyScreenName = '';
        self.inReplyToStatusId = '';
      });
    },

    setReply: function(screenName, tweetId) {
      this.tweettext = '@' + screenName + ' ';
      this.replyScreenName = screenName;
      this.inReplyToStatusId = tweetId;
      document.getElementById('tweettext').focus();
    }
  }
});