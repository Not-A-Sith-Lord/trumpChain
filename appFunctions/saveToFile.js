const fs              = require('fs');
const updateJsonFile  = require('update-json-file');
const stringify       = require('json-stable-stringify');

module.exports =  function saveToFile( newTweets ){

  newTweets.sort((a,b)=> new Date(b.originalContent.created_at) - new Date(a.originalContent.created_at));
  newTweets.forEach(tweetRecord => {



    //Generating filePath:
    const year = new Date(tweetRecord.originalContent.created_at).getFullYear(); //Current year
    const month = new Date(tweetRecord.originalContent.created_at).getMonth() + 1; //Current month
    const date = new Date(tweetRecord.originalContent.created_at).getDate();
    const filePath = `./tweetResults/tweets-${year}-${month}.txt`; //1 file per month

    const textToWrite =
      'Date: ' + date + '/n' +
      'receipt: ' + tweetRecord.receipt.receipt + '\n' +
      'originalContent: ' + stringify(tweetRecord.originalContent) + '\n' + '------------------------------------------------------' + '\n';

    fs.appendFileSync(filePath, textToWrite );
    console.log(`Added new tweet to file = '${filePath}', tweet text = ${tweetRecord.originalContent.text}`);

  })
}

