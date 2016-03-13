var Timeline = function(client) {
	this.client = client;
};

Timeline.prototype = {
	getTimeline: function() {
		var self = this;
		var vue = new Vue({
			el: '.timeline',
			data: {
				tweets: [],
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
						console.log(tweet.text);
						cls.tweets.push(tweet);
					});

					stream.on('error', function(error) {
						throw error;
					});
				});
			}
		});
	}
}