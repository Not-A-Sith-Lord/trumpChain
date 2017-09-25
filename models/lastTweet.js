const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lastTweetSchema = new Schema({
  tweet_id_str: String
});

//actual model
const lastTweet = mongoose.model('lastTweet', lastTweetSchema);


module.exports = lastTweet;