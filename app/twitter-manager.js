var TwitterManager = function(client) {
  this.client = client;
  this.params = {
    include_entities: true
  };
  this.stream = null;
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

  getTimeline: function(sinceId, callback) {
    var params = this.params;
    if (sinceId != null) {
      params.since_id = sinceId;
    }
    this.client.get('statuses/home_timeline', params, function(error, tweets, response) {
      if (!error) {
        callback(tweets);
      } else {
        throw error;
      }
    });

  },

  getMentionsTimeline: function(sinceId, callback) {
    var params = this.params;
    if (sinceId != null) {
      params.since_id = sinceId;
    }
    this.client.get('statuses/mentions_timeline', params, function(error, tweets, response) {
      if (!error) {
        callback(tweets);
      } else {
        throw error;
      }
    });

  },

  getFavoritesList: function(sinceId, callback) {
    var params = this.params;
    if (sinceId != null) {
      params.since_id = sinceId;
    }
    this.client.get('favorites/list', params, function(error, tweets, response) {
      if (!error) {
        callback(tweets);
      } else {
        throw error;
      }
    });

  },

  getUserStream: function(callback) {
    var self = this;
    this.client.stream('user', this.params, function(stream) {

      // UserStreamが2重に接続されるのを防ぐ
      if (self.stream != null) {
        self.stream.destroy();
      }
      self.stream = stream;

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
    if (inReplyToStatusId !== '' && (tweet.indexOf('@' + replyScreenName) !== -1)) {
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
      if (error) {
        throw error;
      }
    });
  },

  createFavorite: function(tweetId, callback) {
    this.client.post('favorites/create', {
      id: tweetId
    }, function(error) {
      if (error) {
        throw error;
      } else {
        callback(true);
      }
    });
  },

  destroyFavorite: function(tweetId, callback) {
    this.client.post('favorites/destroy', {
      id: tweetId
    }, function(error) {
      if (error) {
        throw error;
      } else {
        callback(true);
      }
    });
  }
};

module.exports = TwitterManager;