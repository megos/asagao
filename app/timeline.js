function getTimeline(client) {
	var vue = new Vue({
		el: '#timeline',
		data: {
			tweets: [],
		},
		created: function() {
			var self = this;
			console.log(client);
			client.get('statuses/home_timeline', function(error, tweets, response){

			  if (!error) {
			  	console.log(tweets);
			  	self.tweets = tweets;
			  } else {
			  	console.log(error);
			  }
			});
		}
	})
}