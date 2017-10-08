module.exports = {

  twitter: {
    tokens: {
      consumer_key:         '',
      consumer_secret:      '',
      access_token:         '',
      access_token_secret:  ''
    },
    // userId: '25073877'       //TRUMP account (twitter account ID, will be reading tweets from this user)
  },

  tierion: {
    tokens: {
      access_token : "",
      refresh_token : ''
    },
    root: 'http://204013c9.ngrok.io'
  },

  github: {
    remote_url: 'https://github.com/oleh-kolinko/trumpTweets.git' //Repo that all new tweets will be pushed
  }
};
