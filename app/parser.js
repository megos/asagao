var Parser = function() {

};

Parser.prototype = {
	tweetParse: function(tweet) {
		if (tweet.created_at != null && tweet.text != null) {
			// 相対時間に変更
			tweet.created_at = moment(tweet.created_at).fromNow();

			// 改行コード
			tweet.text = tweet.text.replace(/[\n\r]/g, '<br>');

			// 画像、動画がある場合
			if (tweet.extended_entities != null) {
				tweet.media = [];
				var media = tweet.extended_entities.media;
				for (var mi = 0; mi < media.length; mi++) {
					var type = media[mi].type;
					if (type == 'photo') {
						tweet.media.push({url_thumb: media[mi].media_url + ':thumb',
										  url_image: media[mi].media_url,
										  height: media[mi].sizes.medium.h,
										  width: media[mi].sizes.medium.w});
					} else if (type == 'video') {
						var variants = tweet.extended_entities.media[mi].video_info.variants;
						for (var vi = 0; vi < variants.length; vi++) {
							// TODO: ビットレートの対応
							if (variants[vi].content_type == 'video/mp4') {
								tweet.media.push({url_thumb: media[mi].media_url,
												  url_video: variants[vi].url,
												  height: media[mi].sizes.medium.h,
												  width: media[mi].sizes.medium.w});
								break;
							}
						}
					}
				}
			}

			// ユーザー(@hoge)、ハッシュタグ、URLをリンクに変更
			console.log(autolinker);
			tweet.text = autolinker.link(tweet.text);

			// 公式リツイート
			if (tweet.retweeted_status) {
				var retweeted_user = tweet.user.name;
				tweet = this.tweetParse(tweet.retweeted_status);
				tweet.retweeted = true;
				tweet.retweeted_user = retweeted_user;
			}

			// コメント付き公式リツイート
			if (tweet.is_quote_status) {
				console.log(tweet.quoted_status);
				tweet.rt = this.tweetParse(tweet.quoted_status);
			}
			return tweet;
		}
	}
};

module.exports = Parser;