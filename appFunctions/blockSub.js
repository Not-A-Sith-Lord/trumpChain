
const config = require('../config.js').tierion;
const hashclient = require('hashapi-lib-node');
const access_token = config.tokens.access_token;
const refresh_token = config.tokens.refresh_token;
const hashClient = new hashclient(access_token, refresh_token);

module.exports = (input) => {
  console.log('Creating new block subscription')
  //Payload url info for blockSub. destId is changed by resetBlockSub.
  var root = config.root;
  var destId = Date.now();

    //Just used this site for manual testing, will ultimatly be /check/:id route
    var parameters = {
      "callbackUrl":  root + '/check/' ,
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
