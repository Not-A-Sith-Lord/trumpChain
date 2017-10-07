const express = require('express');
const router = express.Router();
const pendingReceipt = require('../models/pendingReceipt');
const tweetRecord = require('../models/tweetRecord');
const async = require('async');

const config = require('../config.js');

const hashclient = require('hashapi-lib-node');
const access_token = config.tierion.tokens.access_token;
const refresh_token = config.tierion.tokens.refresh_token;
const hashClient = new hashclient(access_token, refresh_token);

const saveToFile = require('../appFunctions/saveToFile.js');
const pushToRemoteRepo = require('../appFunctions/pushToRemoteRepo.js');

router.post(`/check`, (req,res,next) => {
  //Latest block in the blockchain was published

  //We want to go through all our pending receipts
  //And fetch the receipts to store with the original content on our git and DB

  pendingReceipt.find((err, results) => {

    let newTweets = []; //All new tweets


    async.eachSeries(results, iteratee, doAfter);  //Go through each "Pending Receipt"

    function iteratee(result, callback) {

        //Request receipt from flient using receipt ID stored in the the "Pending Receipt"
        hashClient.getReceipt(result.receiptId, (err, receipt) => {
          if(err) {
            console.log(err);
            return next(err);
          } else {
                console.log("Sucessfully recieved blockchain receipt");


            //Now take blockchain receipt and create a "Tweet Record" by combining the receipt and original content in an object
            var newTweetRecord = new tweetRecord({
              receipt: receipt,
              originalContent: result.originalContent
            });


            //Save the new Tweet Record
            newTweetRecord.save((err, newTweet) => {
              if (err){console.log(err)}
              else{
                console.log("it saved!");



              //Since the Tweet Record is sucessfully saved, delete its corresponding pendingReceipt
                pendingReceipt.findByIdAndRemove(result._id, (err, pend) => {
                  if(err) return console.log(err);
                  console.log("it was removed!");

                  //push to write file
                  newTweets.push( newTweetRecord );

                  callback();
              });
              // callback();
              }
            })
          }
        })
      }

    function doAfter(err){
      if(err) console.log(err);

      saveToFile(newTweets);

      if(congif.github.remote_url) pushToRemoteRepo();

      res.sendStatus(200);
    }


  });
  //End of Find

  });
  //End of check/:random

module.exports = router;
