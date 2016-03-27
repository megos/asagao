var Client = function(consumer_key, consumer_secret, access_token_key, access_token_secret) {
  var Twitter = require('twitter');

  this.consumer_key        = consumer_key;
  this.consumer_secret     = consumer_secret;
  this.access_token_key    = access_token_key;
  this.access_token_secret = access_token_secret;

  this.client = new Twitter({
    consumer_key: this.consumer_key,
    consumer_secret: this.consumer_secret,
    access_token_key: this.access_token_key,
    access_token_secret: this.access_token_secret
  });
};

Client.prototype = {
  getClient: function() {
    return this.client;
  }
};

module.exports = Client;