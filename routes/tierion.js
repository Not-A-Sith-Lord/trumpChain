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

      console.log("Saving to file");
      saveToFile(newTweets);
      res.sendStatus(200);

      //Create new subscription to next block
      // createNewBlockSub();
    }


  });
  //End of Find

  });
  //End of check/:random

function saveToFile( newTweets ){
  //data is array of new tweets

  //Generating filePath:
  const year = new Date().getFullYear(); //Current year
  const month = new Date().getMonth() + 1; //Current month
  const filePath = `./tweetResults/tweets-${year}-${month}.json`; //1 file per month


  //Create new file if it's not exist
  if (!fs.existsSync(filePath)) {
    const startingJSON =  '[]' ; //Simplest JSON for holding array

    fs.writeFileSync(filePath, startingJSON , 'utf8', (err) => {
      if (err) return console.log(err);
      console.log(`The file was succesfully created! filePath = ${filePath}`);
    });
  }

  //Add all new tweets to JSON file:
  updateJsonFile(filePath, (data) => {
    console.log(`Updating file. filePath = '${filePath}'`);

    //Combine old data(in file) with new data(new tweets):
    data = [ ...data, ...newTweets ];
    return data
  });
}



module.exports = {
  router: router
};
