const fs              = require('fs');
const updateJsonFile  = require('update-json-file');

module.exports =  function saveToFile( newTweets ){

  newTweets.forEach(tweet => {

    //Generating filePath:
    const year = new Date(tweet.originalContent.created_at).getFullYear(); //Current year
    const month = new Date(tweet.originalContent.created_at).getMonth() + 1; //Current month
    const filePath = `./tweetResults/tweets-${year}-${month}.txt`; //1 file per month

    fs.appendFileSync(filePath,  JSON.stringify(tweet, null, 4) + '\n');
    console.log(`Added new tweet to file = '${filePath}', tweet text = ${tweet.originalContent.text}`);

  })
}
