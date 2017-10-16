const Twit   = require('twit');
const config = require('../config.js').twitter;
const submitNewTwit = require('./submitNewTwit.js');

var a = module.exports = () => {
  const T = new Twit(config.tokens);//Configure twitter API Client

  var stream = T.stream('statuses/filter', { follow: config.userId  });//Create stream
  console.log(`Twitter stream started, following userId = ${config.userId}`);

  stream.on('tweet', tweet => {
    if(tweet.user.id_str === config.userId ) {//Filtering retweets
      //Filter unnecesery fields
        tweet = {
          text      : tweet.text,
          created_at: tweet.created_at,
          screen_name    : tweet.user.screen_name
        }
        
        console.log(`TwitterAPI: Yeah, we got new tweet with text: '${tweet.text}'`);
        submitNewTwit(tweet);
    }

  });
}
