var TwitterAuth = function(consumerKey, consumerSecret) {
  this.consumerKey = consumerKey;
  this.consumerSecret = consumerSecret;
};

TwitterAuth.prototype.getTwitterAuth = function() {
  var twitterAPI = require('node-twitter-api');

  var twitter = new twitterAPI({
    consumerKey: this.consumerKey,
    consumerSecret: this.consumerSecret,
    callback: 'http://tmegos.hatenablog.jp' // 別にどこでもよい
  });


  twitter.getRequestToken(function(error, requestToken, requestTokenSecret) {
    var url = twitter.getAuthUrl(requestToken);
    var loginWindow = new BrowserWindow({width: 800, height: 600});
    loginWindow.webContents.on('will-navigate', function (event, url) {
      var matched;
      if(matched = url.match(/\?oauth_token=([^&]*)&oauth_verifier=([^&]*)/)) {
        twitter.getAccessToken(requestToken, requestTokenSecret, matched[2], function(error, accessToken, accessTokenSecret){
          var auth = {
            accessTokenKey: accessToken,
            accessTokenSecret: accessTokenSecret
          };
          localStorage.setItem('auth', JSON.stringify(auth));
        });
      }
      event.preventDefault();
      loginWindow.close();
    });
    loginWindow.loadUrl(url);
  });
};

module.exports = TwitterAuth;