var Timeline = function(client) {
	this.client = client;
};

Timeline.prototype = {
	getTimeline: function(callback) {
		this.client.get('statuses/home_timeline', function(error, tweets, response){
			if (!error) {
				callback(tweets);
			} else {
				throw error;
			}
		});

	},

	getUserStream: function(callback) {
		this.client.stream('user', function(stream) {
			stream.on('data', function(data) {
				console.log(data);
				callback(data);
			});

			stream.on('error', function(error) {
				throw error;
			});
		});
	},

	postTweet: function(tweet, callback) {
        this.client.post('statuses/update', {
            status: tweet
        }, function(error, tweet, response) {
            if (!error) {
                callback(response);
            } else {
                throw error;
            }
        });
	}
};

module.exports = Timeline;