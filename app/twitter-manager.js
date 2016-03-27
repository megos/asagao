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
    }, function(error, user, response) {
      if (!error) {
        callback(user);
      } else {
        throw error;
      }
    });
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

  postTweet: function(tweet, replyScreenName, inReplyToStatusId, callback) {
    var params = [];
    params.status = tweet;
    if (inReplyToStatusId !== '' && (tweet.indexOf('@' + replyScreenName) != -1)) {
      params.in_reply_to_status_id = inReplyToStatusId;
    }
    this.client.post('statuses/update', params, function(error, tweet, response) {
      if (!error) {
        callback(response);
      } else {
        throw error;
      }
    });
  },

  deleteTweet: function(tweetId, callback) {
    this.client.post('statuses/destroy', {
      id: tweetId
    }, function(error) {
      if (!error) {

      } else {
        throw error;
      }
    });
  }
};

module.exports = TwitterManager;