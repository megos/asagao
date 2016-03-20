var Client = function(consumer_key, consumer_secret, access_token_key, access_token_secret) {
  this.consumer_key = consumer_key;
  this.consumer_secret = consumer_secret;
  this.access_token_key = access_token_key;
  this.access_token_secret = accessTokenSecret;
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