import Twitter from 'twitter'
import storage from 'electron-json-storage-sync'
import { credentials, keys } from '../../constants'

const oauthInfo = storage.get(keys.OAUTH_TOKEN)

// TODO: oauthInfo get failure
const client = new Twitter({
  consumer_key: credentials.CONSUMER_KEY,
  consumer_secret: credentials.CONSUMER_SECRET,
  access_token_key: oauthInfo.data.oauth_access_token,
  access_token_secret: oauthInfo.data.oauth_access_token_secret
})

export const twitterClient = {
  postTweet (status) {
    const params = {
      status: status
    }
    return new Promise((resolve, reject) => {
      client.post('statuses/update', params, (err, tweets, res) => {
        if (!err) {
          resolve(tweets)
        } else {
          reject(err)
        }
      })
    })
  }
}
