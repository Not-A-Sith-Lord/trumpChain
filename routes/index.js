const express = require('express');
const router  = express.Router();
const download = require('download-git-repo');
const unzip = require('unzip');
const fs = require('fs');






/* GET home page. */
//***To be converted to business logic that runs every hour***
router.get('/', (req, res, next) => {

  //This will hold the new tweets yet to be encoded
  const memArray = [];
  const overflow = [];

  //List of last tweets which were added to memArray
  const LastTweet = require('../models/lastTweet.js');


  //Download updated repo of all trump tweets
  download('bpb27/trump_tweet_data_archive', 'tweetResults', (err) => {
    console.log(err ? 'Error' : 'Success');

  //Take 2017 json file from results and unzip
  fs.createReadStream('tweetResults/condensed_2017.json.zip').pipe(unzip.Extract({ path: 'parsedTweets' }));
  //unzipped 2017 tweets
  const parsedTweets = require('../parsedTweets/condensed_2017.json');


  //Get id of last encoded tweet for conditional to exit loop
  LastTweet.find((err, returnedLastTweets) => {
    if (err){
      //Need to fail gracefully and retry later
      return next(err);
      }
      //Twitter ID of last tweet we added to memArray
      const lastTweetId = returnedLastTweets[returnedLastTweets.length - 1].tweet_id_str;


  // console.log("LAST TWEET ID IS------------" + lastTweet + "-------------------------");

  //To stop adding
  let doneLooping = false;
  //Loop through tweets, push wanted info into new [{},{}] to publish blockchain
  for (const [index, tweet] of parsedTweets.entries()) {

    //if the tweet has already been encoded
    if (tweet.id_str === lastTweetId){
      doneLooping = true;
      newLastTweetId = parsedTweets[0].id_str;

      const newLastTweet = new LastTweet({tweet_id_str: newLastTweetId});
      console.log("THIS IS THE NEW LAST TWEET:" + newLastTweet);

      newLastTweet.save((err, result) => {
        if (err) return next(err);
        console.log(result);
        console.log("---------------------END LOOP----------------------------");

      });


    }
    //End IF





    // ELSE These are tweets that will be pushed to encode prep
    if (!doneLooping) {

      //Will control the cut off point, and trigger to encode the memArray into blockchain
      const txSize = 10;

      if (memArray.length > txSize) {
        overflow.push({
          text: tweet.text,
          createdAt: tweet.created_at
        });
      } else {
        memArray.push({
          text: tweet.text,
          createdAt: tweet.created_at
        });
      }


  }

  };
console.log("MEM ARRAY: " + memArray);
  //End of looping, memArray now populated and ready to encode
  //Extra tweets are backed up in overflow array




    res.render('index');
  })
//End of LastTweet find
  });
//End of Repo download



});

module.exports = router;
