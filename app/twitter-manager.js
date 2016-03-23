var TwitterManager = function(client) {
  this.client = client;
  this.params = {
    include_entities: true
  };
};

TwitterManager.prototype = {
  getUserInfo: function(userId, callback) {
    this.client.get('users/show', {
      user_id: userId
    }, function(error, data, response) {
      console.log(data);
    })
  },

  getTimeline: function(callback) {
    this.client.get('statuses/home_timeline', this.params, function(error, tweets, response) {
      if (!error) {
        callback(tweets);
      } else {
        throw error;
      }
    });

  },

  getMentionsTimeline: function(callback) {
    this.client.get('statuses/mentions_timeline', this.params, function(error, tweets, response) {
      if (!error) {
        callback(tweets);
      } else {
        throw error;
      }
    });

  },

  getUserStream: function(callback) {
    this.client.stream('user', this.params, function(stream) {
      stream.on('data', function(data) {
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

module.exports = TwitterManager;