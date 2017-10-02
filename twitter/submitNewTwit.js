const sha256 = require('sha256');
const pendingReceipt = require('../models/pendingReceipt');

const config = require('../config.js').tierion;
const hashclient = require('hashapi-lib-node');
const access_token = config.tokens.access_token;
const refresh_token = config.tokens.refresh_token;
const hashClient = new hashclient(access_token, refresh_token);

module.exports = (input) => {

    //The tweet info we want to encode will be the input for the function, which is this whole route.
    //We hash the input for the API while also saving it to later include with the blockchain Receipt

    //We get to define the input standard for politician's tweets
    //This is what you need and how to combine it to verify the hash later
    //I think we just need text and exact twitter time, and hash that like so:

    // var input = {
    //   text: 'Ariel Deschapell',
    //   created_at: 'Mon Sep 27 15:28:02 +0000 2017'
    // } //example


    var convertedInput = JSON.stringify(input);
    // console.log(typeof convertedInput);
    // console.log(convertedInput)

    const hash = sha256(convertedInput); //input will go here
    // console.log('hash = ', hash);



    hashClient.submitHashItem(hash, (err, result) =>{
      if(err) {
          console.log("Error in submit hash item: ");
          console.log(err);
          return next(err);
      } else {
        console.log("Hash item accepted for encoding");

        //save the original content with blockchain receipt id to retrieve later
        const newPendingReceipt = new pendingReceipt({
          originalContent: input,
          receiptId: result.receiptId
        });

        //This doesn't have to be async i think?
        newPendingReceipt.save((err, result) => {
          if (err) return next(err);
           console.log("New pending receipt saved");


        });





      }
  });
}
