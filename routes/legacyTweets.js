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


const axios = require('axios');
const sha256 = require('sha256');

router.get('/legacy', (req,res,next) => {


//To encode legacy tweet data you have to manually link the source in json.
//And simply trigger this route
var data = require("../parsedTweets/test.json");
var data2 = require("../parsedTweets/condensed_2017.json");


  async.eachSeries(data, iteratee, doAfter);

  function iteratee(tweet, callback){
    console.log("===== Iterating Legacy Data ======")

    var input = {
      text: tweet.text,
      created_at: tweet.created_at
    }
    console.log("Tweet to encode: ");
    console.log(input);


    var convertedInput = JSON.stringify(input);
    const hash = sha256(convertedInput);


    console.log("HASH of tweet content is: " + hash);
      hashClient.submitHashItem(hash, (err, result) =>{
        if(err) {
            console.log("----Error in submit hash item API call----- ");
            console.log(err);
            return next(err);

        } else {

          console.log("-------HASH item accepted for encoding-----");

          //save the original content with blockchain receipt id to retrieve later
          const newPendingReceipt = new pendingReceipt({
            originalContent: input,
            receiptId: result.receiptId
          });
          console.log("------New Pending Reciept Created-----")
          console.log(newPendingReceipt);

          newPendingReceipt.save((err, result) => {
            if (err) {
              console.log(err);
              return next(err);
            } else {
             console.log("------New Pending Reciept Saved-----")
             callback();
           }

           });


        }

      });

  }

  function doAfter(){

       var parameters = {
           "callbackUrl":  root + destId ,
           "label": "Production"
       }


       hashClient.createBlockSubscription(parameters, (err, result) =>{
         if(err) {
           console.log("Error in create block subscription: ");
           console.log(err);

           return next(err);
         } else {
           console.log(result);

           //If it's all good it's all good then it's all good
           res.render('index');
         }
       });
     }
});



module.exports = router;
//recepeint id
//59c9d46ae4a70229ae2edb00
