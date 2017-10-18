const fs              = require('fs');
const updateJsonFile  = require('update-json-file');
const stringify       = require('json-stable-stringify');
const async           = require('async');

module.exports =  function saveToFile( newTweets ){

  newTweets.forEach(tweetRecord => {

    //Generating filePath:
    const year = new Date(tweetRecord.originalContent.created_at).getFullYear(); //Current year
    const month = new Date(tweetRecord.originalContent.created_at).getMonth() + 1; //Current month
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

    newTweets = newTweets.filter( tweet => !data.includes(tweet));//Filter dubplicates if there are any
    let fixedTweets = [];

    async.eachSeries(newTweets, iteratee, doAfter);

      function iteratee(tweet, callback){
        console.log("Original tweet is......");
        console.log(tweet);
        fixedTweet = {
          receipt: tweet.receipt,
          originalContent: stringify(tweet.originalContent)
        }
        console.log("Fixed tweet is......");
        console.log(fixedTweet);
        fixedTweets.push(fixedTweet);
        callback();

      }

      function doAfter(err){
        if (err){ console.log(err)}
          console.log(fixedTweets);
        //Combine old data(in file) with new data(new tweets):
        data = [ ...data, ...fixedTweets ];
        return data

      }



  });
});
}