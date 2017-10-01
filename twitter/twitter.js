const Twit   = require('twit');
const config = require('./config.js');

module.exports = () => {
  const T = new Twit(config.tokens);//Configure twitter API Client

  var stream = T.stream('statuses/filter', { follow: config.userId  });//Create stream
  console.log(`Twitter stream started, following userId = ${config.userId}`);

  stream.on('tweet', tweet => {
    if(tweet.user.id_str === config.userId ) //Filtering retweets
      tweet = {
        created_at: tweet.created_at,
        text      : tweet.text
      }
      console.log(tweet);
  });
}
