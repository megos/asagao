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
				  	cls.tweets = tweets;
				  } else {
				  	console.log(error);
				  }
				});

				self.client.stream('user', function(stream) {
					stream.on('data', function(tweet) {
						console.log(tweet);
						cls.tweets.unshift(tweet);
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
							  this.tweettext = '';

						} else {
							console.log(error);
						}
					});
				}
			}
		});
	}
}