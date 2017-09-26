const express = require('express');
const router = express.Router();

const hashclient = require('hashapi-lib-node');
//DANGER TOKENS:
var access_token = '';
var refresh_token = '';
var hashClient = new hashclient(access_token, refresh_token);


const axios = require('axios');
const sha256 = require('sha256');

router.get('/tierion', (req,res,next) => {
  const hash = sha256('hello');//example
  console.log('hash = ', hash);


  hashClient.submitHashItem(hash, function(err, result){
    if(err) {
        console.log(err)
    } else {
        console.log(result)
        // process result
    }
  });

});

router.get('/transactionCreated', (req,res,next) => {

})

module.exports = router;
//recepeint id
//59c9d46ae4a70229ae2edb00
