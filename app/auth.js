var TwitterAuth = function(consumerKey, consumerSecret) {
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
};

TwitterAuth.prototype.getTwitterAuth = function() {
    var twitterAPI = require('node-twitter-api');

    var twitter = new twitterAPI({
        consumerKey: this.consumerKey,
        consumerSecret: this.consumerSecret,
        callback: 'file://' + __dirname + '/../view/callback.html'
    });


    twitter.getRequestToken(function(error, requestToken, requestTokenSecret) {
        var token = {
            requestToken: requestToken,
            requestTokenSecret: requestTokenSecret
        };
        localStorage.setItem('token', JSON.stringify(token));
        var url = twitter.getAuthUrl(requestToken);
        mainWindow.loadURL(url);
        
    });
};

module.exports = TwitterAuth;