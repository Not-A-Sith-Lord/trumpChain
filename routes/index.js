const express = require('express');
const router  = express.Router();
const download = require('download-git-repo');
const unzip = require('unzip');
const fs = require('fs');

//global variable, to save which is the last tweet we've published to blockchain

/* GET home page. */

router.get('/', (req, res, next) => {

//To be converted to business logic that runs every hour

download('bpb27/trump_tweet_data_archive', 'tweetResults', (err) => {
  console.log(err ? 'Error' : 'Success');

fs.createReadStream('tweetResults/condensed_2017.json.zip').pipe(unzip.Extract({ path: 'parsedTweets' }));

var parsedTweets = require('../parsedTweets/condensed_2017.json');

console.log(parsedTweets);


parsedTweets.forEach( tweet => {

});



  res.render('index');
})




});

module.exports = router;
