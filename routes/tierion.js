const express = require('express');
const router = express.Router();
const pendingReceipt = require('../models/pendingReceipt');
const tweetRecord = require('../models/tweetRecord');
const async = require('async');
const fs = require('fs');
const updateJsonFile = require('update-json-file');

const config = require('../config.js');

const hashclient = require('hashapi-lib-node');
const access_token = config.tierion.tokens.access_token;
const refresh_token = config.tierion.tokens.refresh_token;
const hashClient = new hashclient(access_token, refresh_token);

router.post(`/check/:random`, (req,res,next) => {
  //Latest block in the blockchain was published
  console.log("Latest block in the blockchain was published");
  //We want to go through all our pending receipts
  //And fetch the receipts to store with the original content on our git and DB

  pendingReceipt.find((err, results) => {

    let newTweets = []; //All new tweets


    async.eachSeries(results, iterate, doAfter);  //Go through each pending receipt

    function iterate(result, callback) {

        //Ask for receipt by id
        hashClient.getReceipt(result.receiptId, (err, receipt) => {
          if(err) {
            console.log(err);
            //There's some kind of preflight header problem here
            // return callback(err);
          } else {
            console.log(`Received receipt. receiptId = ${result.receiptId}`);
            //Now take receipt and save to db and then zip file for repo
            var newTweetRecord = new tweetRecord({
              receipt: receipt,
              originalContent: result.originalContent
            });

            newTweets.push( result.originalContent );
            saveToFile( result.originalContent );
            //note: mongo applies '/' where all the quotes are in the receipt to escape the character
            //That has to be parsed out before being pushed to the git repo page
            newTweetRecord.save((err, newTweet) => {
              if (err){console.log(err)}
              else{
                console.log(`Tweet saved to db.tweetrecords. receiptId = ${result.receiptId}`);

              // If the receipt saves ok remove it from pending
                pendingReceipt.findByIdAndRemove(result._id, (err, pend) => {
                  if(err) return console.log(err);

                  console.log("Receipt removed from db.pendingreceipts. receiptId = ${result.receiptId}");
                  callback();
              });
              }
            })
          }
        })
      }


    function doAfter(err){
      if(err) {
        console.log(err);
        res.sendStatus(500);
      }
      console.log('All receipts finished processing');
      console.log('newTweets = ', newTweets)
      // saveToFile(newTweets);
      //Create new subscription to next block
      // createNewBlockSub();

      res.sendStatus(200);
    }


  });
  //End of Find

  });
  //End of check/:random

function saveToFile( tweets ){
  //tweets is array of new tweets
  if(!Array.isArray(tweets)) tweets = [tweets];//If it's only one obj -> convert it to array

  tweets.forEach( tweet => {
    //Generating filePath:
    const year = new Date(tweet.created_at).getFullYear(); //Current year
    const month = new Date(tweet.created_at).getMonth() + 1; //Current month
    const filePath = `./tweetResults/tweets-${year}-${month}.json`; //1 file per month

    //Create new file if it's not exist
    if (!fs.existsSync(filePath)) {
      const startingJSON =  '[]' ; //Simplest JSON for holding array

      fs.writeFileSync(filePath, startingJSON , 'utf8', (err) => {
        if (err) return console.log(err);
        console.log(`The file was created! filePath = ${filePath}`);
      });

      //Add all new tweets to JSON file:
      updateJsonFile(filePath, (data) => {
        console.log(`Updating file. filePath = '${filePath}', tweet = ${tweet.text}`);

        //Combine old data(in file) with new data(new tweets):
        data = [ ...data, tweet ];
        return data
      });
    }
  });
}

function createNewBlockSub(){
  console.log('Creating new block subscription')
  //Payload url info for blockSub. destId is changed by resetBlockSub.
  var root = config.tierion.root;
  var destId = Date.now();

    //Just used this site for manual testing, will ultimatly be /check/:id route
    var parameters = {
      "callbackUrl":  root + 'check/'  ,
      "label": "Production"
    }


   //if "resetBlockSub" is false it means the tweet is in the same block as
   //the one before and the payload url doesn't change. Create block returns an error
   //but that's not a biggy, we can optimize later.

    hashClient.createBlockSubscription(parameters, (err, result) =>{
        if(err) {
            console.log("Error in create block subscription: ");
            console.log(err);

        } else {
            console.log(result);

            //If it's all good it's all good then it's all good
            // res.render('index');
        }
    });
}


module.exports = {
  router: router,
  createNewBlockSub: createNewBlockSub
};
