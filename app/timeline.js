var Timeline = function(client) {
	this.client = client;
};

Timeline.prototype = {
	getTimeline: function() {
		var self = this;
		var timelineVue = new Vue({
			el: '#main',
			data: {
				tweets: [],
				tweettext: ''
			},
			created: function() {
				var cls = this;
				self.client.get('statuses/home_timeline', function(error, tweets, response){
				  if (!error) {
				  	tweets.forEach(function(tweet) {
				  		if (tweet.created_at != null && tweet.text != null) {
					  		// 相対時間に変更
					  		tweet.created_at = moment(tweet.created_at).fromNow();

					  		// 改行コード
					  		tweet.text = tweet.text.replace(/[\n\r]/g, '<br>');

					  		// 画像、動画がある場合
					  		if (tweet.extended_entities != null) {
					  			tweet.media = [];
					  			var media = tweet.extended_entities.media;
					  			for (var i = 0; i < media.length; i++) {
						  			var type = media[i].type;
						  			if (type == 'photo') {
						  				// tweet.text += ' <a href src=\"tweet.extended_entities.media[i].media_url\">image' + (i + 1) + '</a>';
						  				tweet.media.push({url: media[i].media_url, h: media[i].sizes.medium.h, w: media[i].sizes.medium.w});
						  			} else if (type == 'video') {
						  				var variants = tweet.extended_entities.media[i].video_info.variants;
						  				for (var v = 0; v < variants.length; v++) {
						  					if (variants[i]['content_type'] == 'video/mp4') {
						  						console.log(variants[i]['url']);
						  					}
						  				}
						  				// console.log(tweet.extended_entities.media[i].media_url);
						  			}
					  			}
					  			console.log(tweet.media);
					  		}
					  		cls.tweets.push(tweet);

				  		}
				  	});
				  	console.log(cls.tweets);
				  	// for (var i = 0; i < tweets.length; i++) {
				  	// 	cls.tweets.push(tweets[i]);
				  	// }
				  } else {
				  	console.log(error);
				  }
				});

				self.client.stream('user', function(stream) {
					stream.on('data', function(data) {

						// 新規tweet
				  		if (data.created_at != null && data.text != null) {
					  		// 相対時間に変更
					  		data.created_at = moment(data.created_at).fromNow();
					  		cls.tweets.unshift(data);

					  	// tweet削除
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

					stream.on('error', function(error) {
						throw error;
					});
				});
			},
			methods: {
				tweet: function(event) {
					var cls = this;
					self.client.post('statuses/update', {status: this.tweettext},  function(error, tweet, response){
						  if (!error) {
							  cls.tweets.unshift(tweet);  // Tweet body. 
							  console.log(response);  // Raw response object. 
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
					console.log(height);
					var imageWindow = new BrowserWindow({height: height, width: width});
					imageWindow.loadUrl(url);

					imageWindow.on('closed', function() {
						imageWindow = null;
					});
				}
			}
		});
	}
}