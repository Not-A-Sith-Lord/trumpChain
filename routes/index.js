const express = require('express');
const router  = express.Router();
const download = require('download-git-repo');
const unzip = require('unzip');
const fs = require('fs');
const LastTweet = require('../models/lastTweet.js');


//global variable, to save which is the last tweet we've published to blockchain

/* GET home page. */

router.get('/', (req, res, next) => {

//To be converted to business logic that runs every hour
  //Download repo of trump tweets
  download('bpb27/trump_tweet_data_archive', 'tweetResults', (err) => {
    console.log(err ? 'Error' : 'Success');

  //Take 2017 json file from results and unzip
  fs.createReadStream('tweetResults/condensed_2017.json.zip').pipe(unzip.Extract({ path: 'parsedTweets' }));
  const parsedTweets = require('../parsedTweets/condensed_2017.json');

  // console.log(parsedTweets);

  //Get id of last encoded tweet for conditional to exit loop
  LastTweet.find((err, returnedLastTweets) => {
    if (err){
      //Need to fail gracefully and retry later
      return next(err);
      }
      //get last id not first

      const lastTweetId = returnedLastTweets[returnedLastTweets.length - 1].tweet_id_str;




  // console.log("LAST TWEET ID IS------------" + lastTweet + "-------------------------");

  //Loop through tweets, push wanted info into new [{},{}] to publish blockchain

  for (const [index, tweet] of parsedTweets.entries()) {

    //if the tweet has already been encoded
    if (tweet.id_str === lastTweetId){

      newLastTweetId = parsedTweets[index - 1].id_str;

      const newLastTweet = new LastTweet({tweet_id_str: newLastTweetId});
      console.log("THIS IS THE NEW LAST TWEET:" + newLastTweet);

      newLastTweet.save((err, result) => {
        if (err) return next(err);
        console.log(result);
        console.log("---------------------END LOOP----------------------------");

      });

      return;
    }
    //End IF
    console.log("-----------------");

    //These are tweets that will be pushed to encode prep
    console.log(tweet.text);
  };



    res.render('index');
  })
//End of LastTweet find
  });
//End of Repo download



});

module.exports = router;
