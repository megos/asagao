var Parser = function() {
  this.moment = require('moment');
  var Autolinker = require('autolinker');
  this.moment.locale('ja');
  this.autolinker = new Autolinker({
    twitter: true,
    hashtag: 'twitter'
  });
};

Parser.prototype = {
  tweetParse: function(tweet) {
    if (tweet.created_at != null && tweet.text != null) {


      tweet.media = [];

      // 相対時間に変更
      tweet.relative_created_at = this.moment(tweet.created_at).fromNow();

      // 改行コード
      tweet.text = tweet.text.replace(/[\n\r]/g, '<br>');

      // 画像、動画がある場合
      if (tweet.extended_entities != null) {
        var media = tweet.extended_entities.media;
        for (var mi = 0; mi < media.length; mi++) {
          var type = media[mi].type;
          if (type == 'photo') {
            tweet.media.push({
              url_thumb: media[mi].media_url + ':thumb',
              url_image: media[mi].media_url,
              height: media[mi].sizes.medium.h,
              width: media[mi].sizes.medium.w
            });
          } else if (type == 'video' || type == 'animated_gif') {
            var variants = tweet.extended_entities.media[mi].video_info.variants;
            for (var vi = 0; vi < variants.length; vi++) {
              // TODO: ビットレートの対応
              if (variants[vi].content_type == 'video/mp4') {
                tweet.media.push({
                  url_thumb: media[mi].media_url,
                  url_video: variants[vi].url,
                  height: media[mi].sizes.medium.h,
                  width: media[mi].sizes.medium.w
                });
                break;
              }
            }
          }
        }
      }

      // 短縮URL展開
      var urls = tweet.entities.urls;
      for (var ui = 0; ui < urls.length; ui++) {
        tweet.text = tweet.text.replace(urls[ui].url, urls[ui].expanded_url);

        // instagram
        var shortcode = '';
        if (shortcode = urls[ui].display_url.match(/^instagram\.com\/p\/(.*)\//)) {
          // TODO: 画像サイズを調べる
          tweet.media.push({
            url_thumb: 'https://instagram.com/p/' + shortcode[1] + '/media/?size=t',
            url_image: 'https://instagram.com/p/' + shortcode[1] + '/media/?size=l',
            height: 500,
            width: 500
          });
        }

        // twipple
        var imageId = '';
        if (imageId = urls[ui].display_url.match(/^p\.twipple\.jp\/(.*)/)) {
          tweet.media.push({
            url_thumb: 'http://p.twipple.jp/show/thumb/' + imageId[1],
            url_image: 'http://p.twipple.jp/show/large/' + imageId[1],
            height: 500,
            width: 500
          });
        }
      }

      // ユーザー(@hoge)、ハッシュタグ、URLをリンクに変更
      tweet.text = this.autolinker.link(tweet.text);

      // 公式リツイート
      if (tweet.retweeted_status) {
        var retweeted_user = tweet.user.name;
        tweet = this.tweetParse(tweet.retweeted_status);
        tweet.retweeted = true;
        tweet.retweeted_user = retweeted_user;
      }

      // コメント付き公式リツイート
      if (tweet.is_quote_status) {
        tweet.rt = this.tweetParse(tweet.quoted_status);
      }
      return tweet;
    }
  },

  setRelativeCreatedAt: function(tweet) {
    // 相対時間に変更
    tweet.relative_created_at = this.moment(tweet.created_at).fromNow();
    return tweet;
  }
};

module.exports = Parser;