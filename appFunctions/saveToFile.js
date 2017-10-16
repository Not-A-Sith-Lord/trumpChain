const fs              = require('fs');
const updateJsonFile  = require('update-json-file');
const stringify       = require('json-stable-stringify');

module.exports =  function saveToFile( newTweets ){

  newTweets.forEach(tweetRecord => {

    //Generating filePath:
    const year = new Date(tweetRecord.originalContent.created_at).getFullYear(); //Current year
    const month = new Date(tweetRecord.originalContent.created_at).getMonth() + 1; //Current month
    const filePath = `./tweetResults/tweets-${year}-${month}.txt`; //1 file per month

    const textToWrite =
      'receipt          =' + stringify(tweetRecord.receipt.receipt) + '\n' +
      'originalContent  =' + stringify(tweetRecord) + '\n\n';

    fs.appendFileSync(filePath, textToWrite );
    console.log(`Added new tweet to file = '${filePath}', tweet text = ${originalContent.text}`);

  })
}
