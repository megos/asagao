function getTimeline(client) {
	var vue = new Vue({
		el: '.timeline',
		data: {
			tweets: [],
		},
		created: function() {
			var self = this;
			client.get('statuses/home_timeline', function(error, tweets, response){

			  if (!error) {
			  	self.tweets = tweets;
			  } else {
			  	console.log(error);
			  }
			});
		}
	})
}