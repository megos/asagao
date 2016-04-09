var remote         = require('remote');
var dialog         = remote.require('dialog');
var BrowserWindow  = remote.require('browser-window');
var Vue            = require('vue');
var settings       = require('../app/settings');
var Client         = require('../app/client');
var TwitterManager = require('../app/twitter-manager');
var Parser         = require('../app/parser');

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
Vue.component('timeline-favorites', tweetComponent);

setTimeout(function() {
  var timelineVue = new Vue({
    el: '#main',
    data: {
      user             : [],
      tweets           : [],
      mentions         : [],
      favorites        : [],
      tweettext        : '',
      replyScreenName  : '',
      inReplyToStatusId: '',
      title            : 'Timeline'
    },
    created: function() {
      this.tweetload(true);
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
      },

      setTitle: function(title) {
        this.title = title;
      },

      tweetload: function(isFirst) {
        var self = this;

        var timelineId  = null;
        var mentionsId  = null;
        var favoritesId = null;

        if (this.tweets.length > 0) {
          timelineId = this.tweets[0].id_str;
        }
        if (this.mentions.length > 0) {
          mentionsId = this.mentions[0].id_str;
        }
        if (this.favorites.length > 0) {
          favoritesId = this.favorites[0].id_str;
        }

        twitterManager.getUserInfo(userId, function(user){
          self.user = user;
        });

        twitterManager.getTimeline(timelineId, function(tweetsRow) {
          for (var i = 0; i < tweetsRow.length; i++) {
            self.tweets.push(parser.tweetParse(tweetsRow[i]));
          }
        });

        if (isFirst) {
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
        }

        twitterManager.getMentionsTimeline(mentionsId, function(tweetsRow) {
          for (var i = 0; i < tweetsRow.length; i++) {
            self.mentions.push(parser.tweetParse(tweetsRow[i]));
          }
        });

        twitterManager.getFavoritesList(favoritesId, function(tweetsRow) {
          for (var i = 0; i < tweetsRow.length; i++) {
            self.favorites.push(parser.tweetParse(tweetsRow[i]));
          }
        });
      }
    }
  });
}, 1);