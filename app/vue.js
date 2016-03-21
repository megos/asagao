setTimeout(function() {
  var timelineVue = new Vue({
    el: '#main',
    data: {
      tweets: [],
      mentions: [],
      tweettext: ''
    },
    created: function() {
      var self = this;

      timeline.getTimeline(function(tweetsRow) {
        for (var i = 0; i < tweetsRow.length; i++) {
          self.tweets.push(parser.tweetParse(tweetsRow[i]));
        }
        console.log(self.tweets);
      });

      timeline.getUserStream(function(data) {
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

      timeline.getMentionsTimeline(function(tweetsRow) {
        for (var i = 0; i < tweetsRow.length; i++) {
          self.mentions.push(parser.tweetParse(tweetsRow[i]));
        }
      });
    },
    methods: {
      tweet: function(event) {
        var self = this;
        timeline.postTweet(this.tweettext, function(callback) {
          self.tweettext = '';
        });
      },
      openImageWindow: function(url, height, width, event) {
        // TODO: マジックナンバーをどうにかする
        var titleBarHeight = 22;
        var imageWindow = new BrowserWindow({
          height: height + titleBarHeight,
          width: width
        });
        imageWindow.loadUrl(url);
        imageWindow.on('closed', function() {
          imageWindow = null;
        });
      }
    }
  });
}, 0);