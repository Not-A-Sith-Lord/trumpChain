const fs              = require('fs');
const updateJsonFile  = require('update-json-file');

module.exports = function saveToFile( newTweets ){
  //newTweets is array of new tweets

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

    newTweets = newTweets.filter( tweet => !data.includes(tweet));//Filter dubplicates if there are any

    //Combine old data(in file) with new data(new tweets):
    data = [ ...data, ...newTweets ];
    return data
  });
}
