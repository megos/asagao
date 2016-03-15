var Timeline = function(client) {
	this.client = client;
};

Timeline.prototype = {
	getTimeline: function(callback) {
		var self = this;
		self.client.get('statuses/home_timeline', function(error, tweets, response){
			if (!error) {
				callback(tweets);
			}
		});

	},

	getUserStream: function(callback) {
		var self = this;
		self.client.stream('user', function(stream) {
			stream.on('data', function(data) {
				console.log(data);
				callback(data);
			});

			stream.on('error', function(error) {
				throw error;
			});
		});
	}
};

module.exports = Timeline;