module.exports = {

  twitter: {
    tokens: {
      consumer_key:         '',
      consumer_secret:      '',
      access_token:         '',
      access_token_secret:  ''
    },
    userId: '912871553133662208' //TEST account (twitter account ID, will be reading tweets from this user)
    // userId: '25073877'       //TRUMP account (twitter account ID, will be reading tweets from this user)
  },

  tierion: {
    tokens: {
      access_token : "",
      refresh_token : ''
    },
    root: 'https://tweet-chain.herokuapp.com'
  },

  github: {
    remote_url: 'https://github.com/oleh-kolinko/trumpTweets.git' //Repo that all new tweets will be pushed
  }
};
