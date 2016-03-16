setTimeout(function() {
    var timelineVue = new Vue({
        el: '#main',
        data: {
            isInitialized: false,
            tweets: [],
            tweettext: ''
        },
        created: function() {
            var cls = this;
            timeline.getTimeline(function(tweetsRow) {
                for (var i = 0; i < tweetsRow.length; i++) {
                    cls.tweets.push(parser.tweetParse(tweetsRow[i]));
                }
                console.log(cls.tweets);
                isInitialized = true;
            });
            timeline.getUserStream(function(data) {
                console.log(data);
                if (data.created_at != null && data.text != null) {
                    cls.tweets.unshift(parser.tweetParse(data));
                } else if (data.delete != null) {
                    console.log(data);
                    for (var i = 0; i < cls.tweets.length; i++) {
                        // 削除tweet id確認
                        if ((cls.tweets[i].id == data.delete.status.id) && (cls.tweets[i].user.id == data.delete.status.user_id)) {
                            cls.tweets.splice(i, 1);
                        }
                    }
                }
            });
        },
        methods: {
            tweet: function(event) {
                var cls = this;
                self.client.post('statuses/update', {
                    status: this.tweettext
                }, function(error, tweet, response) {
                    if (!error) {
                        console.log(response); // Raw response object. 
                        cls.tweettext = '';
                    } else {
                        console.log(error);
                    }
                });
            },
            a: function(event) {
                console.log('a');
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
}, 1);