const push = require('git-push');
const config = require('../config.js');

module.exports = function pushToRemoteRepo(){
  const remoteRepo = {
    name: 'trumpTweets',
    url: config.github.remote_url,
    branch: 'master',
  }
  push('./tweetResults', remoteRepo, function() {
    console.log(`New push to ${remoteRepo.url}`);
  });
}
