const express = require('express');
const router = express.Router();
const pendingReceipt = require('../models/pendingReceipt');
const tweetRecord = require('../models/tweetRecord');

const hashclient = require('hashapi-lib-node');
//DANGER TOKENS:
var access_token = '';
var refresh_token = '';
var hashClient = new hashclient(access_token, refresh_token);

//This is to change the payload domain after each block, or tierion gives you error
var resetBlockSub = false;


//Payload url info for blockSub
var root = "";
var destId = "";

const axios = require('axios');
const sha256 = require('sha256');

router.get('/submit', (req,res,next) => {

  //The tweet info we want to encode will be the input for the function, which is this whole route.
  //We hash the input for the API while also saving it to later include with the blockchain Receipt

  //We get to define the input standard for politician's tweets
  //This is what you need and how to combine it to verify the hash later
  //I think we just need text and exact twitter time, and hash that like so:

  var input = {
    text: 'Ariel Deschapell',
    created_at: 'Mon Sep 27 15:28:02 +0000 2017'
} //example

  var convertedInput=JSON.stringify(input);
  // console.log(typeof convertedInput);
  //  console.log(convertedInput)

  const hash = sha256(convertedInput); //input will go here
  // console.log('hash = ', hash);



  hashClient.submitHashItem(hash, (err, result) =>{
    if(err) {
        console.log("Error in submit hash item: ");
        console.log(err);
    } else {

      //save the original content and the receipt for it's id to retrieve later
      const newPendingReceipt = new pendingReceipt({
        originalContent: input,
        receiptId: result.receiptId
      });

      //This doesn't have to be async i think?
      newPendingReceipt.save((err, result) => {
        if (err) return next(err);
        // console.log(result);
        console.log("---------------------END LOOP----------------------------");

      });

      //<<<<<<<<<<So we have a receipt we're waiting for, so now we create a blocksub so
      //We know when we can retrieve the receipt>>>>>>>>>>>>>>>>


      //If this is true, then change the payload for the blocksub. Just has to be unique per block so I used the latest returned id.
      if (resetBlockSub){
        destId = result.receiptId;
        resetblockSub = false;
      }

      //Just used this site for manual testing, will ultimatly be /check/:id route
      var parameters = {
        "callbackUrl":  root + "http://mockbin.org/bin/a79679e6-3771-4ad8-b340-bb12d3865b4f" + destId ,
  "label": "Production"
      }

      //memArray was for before the DB testing, commented out
      // memArray.push(result.receiptId);

     //if "resetBlockSub" is false it means the tweet is in the same block as
     //the one before and the payload url doesn't change. Create block returns an error then
     //but that's not a biggy, we can optimize later.

      hashClient.createBlockSubscription(parameters, (err, result) =>{
    if(err) {
        console.log("Error in create block subscription: ");
        console.log(err);
        //graceful failure
        return next(err);
    } else {
        console.log(result);

        //If it's all good it's all good then it's all good
        res.render('index');
    }
});




    }
  });



});

router.get(`/check/:id`, (req,res,next) => {

  //They latest block was published so we need to reset the payload url for the next tweet
  resetBlockSub = true;


  //was manually testing
  // idArray = ["59caecaa01647049021fe404","59caecb2b8af0a2f6d757d57","59caecb901647049021fe405"];

  //So now the latest block was published, we want to go through all our pending hashes that are in it
  //And get the receipts to store on our git and DB

  pendingReceipt.find((err, results) => {
    // console.log(results);

      results.forEach((result) => {

        hashClient.getReceipt(result.receiptId, (err, receipt) => {
      if(err) {
        console.log(err);
        return next(err);
      } else {
        // console.log("-------------------------");
        // console.log("RESULT IS: ");
        // console.log(result);

        //Add the original tweet content as a sibling of receipt for verification
        receipt['originalContent'] = result.originalContent;
        console.log("RECIPT IS: ");
        console.log(receipt);


        //Now take receipt and save to db and/or zip file for repo
        var newTweetRecord = new tweetRecord(
          receipt
        );
        newTweetRecord.save((err, newTweet) => {
          if (err){console.log(err)}
          else{
            console.log("it saved!");
            // console.log(result);

            //this is a lil fucked up somehow
            //If the receipt saves ok remove it from pending
            pendingReceipt.findByIdAndRemove(result._id, (err, pend) => {

              console.log("it was removed!");

          });
          }
        })

      }
      });
      });



res.render('index');
  });

})

module.exports = router;
//recepeint id
//59c9d46ae4a70229ae2edb00
