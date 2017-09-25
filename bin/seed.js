const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/trumpChain');
const LastTweet = require('../models/lastTweet');

const startTweet = {
  tweet_id_str: "911717004222091264"
};

LastTweet.create(startTweet, (err, docs) => {
  if (err) { throw err };

  console.log(docs);

  mongoose.connection.close();
});
