module.exports = {

  twitter: {
    tokens: {
      consumer_key:         'tuDiQyYxJBFtLcCgNlA8l1ebu',
      consumer_secret:      'BgcoFBicQy8MEy8ERzuj82PqQAIR2VpN9iEHMTm8HyAFbYukvH',
      access_token:         '2402760295-PgYsTh9sYsmMT8M1HXOr7YWvU7Dk6KRMobsfTtz',
      access_token_secret:  'x2yzYaxltWAGaN9R3yVudzMMgXYyQQ47SdLzdSuqjDweJ'
    },
    userId: '912871553133662208' //TEST account (twitter account ID, will be reading tweets from this user)
    // userId: '25073877'       //TRUMP account (twitter account ID, will be reading tweets from this user)
  },

  tierion: {
    tokens: {
      access_token : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU5Y2FiZmE0MWFiM2FlMjliNzk5YzNkYiIsInJscyI6MTAwLCJybGgiOjEwMDAsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE1MDY0NjM1NjIsImV4cCI6MTUwNjQ2NzE2MiwianRpIjoiMWQ4YjVkNmI5YjdmNDVmZTc0YTJkYTY4MGQ2Y2U1ODJkMDcyZjU4NyJ9.PxQwHYfIbN9PuDrSziJY1uKYjOdGZnQ37JXp4K9MVew",
      refresh_token : 'b18d914f8b3a6753e57e2eabb1c819da5ccfee6d'
    },
    root: 'http://ec2-13-58-126-113.us-east-2.compute.amazonaws.com:3000/'
  },

  github: {
    remote_url: 'ssh://git@github.com/trumpChain/trumpChain.git' //Repo that all new tweets will be pushed
  }
};
