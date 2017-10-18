module.exports = {

  twitter: {
    tokens: {
      consumer_key:         'tuDiQyYxJBFtLcCgNlA8l1ebu',
      consumer_secret:      'BgcoFBicQy8MEy8ERzuj82PqQAIR2VpN9iEHMTm8HyAFbYukvH',
      access_token:         '2402760295-PgYsTh9sYsmMT8M1HXOr7YWvU7Dk6KRMobsfTtz',
      access_token_secret:  'x2yzYaxltWAGaN9R3yVudzMMgXYyQQ47SdLzdSuqjDweJ'
    },
    userId: '2402760295' //TEST account (twitter account ID, will be reading tweets from this user)
    // userId: '25073877'       //TRUMP account (twitter account ID, will be reading tweets from this user)
  },

  tierion: {
    tokens: {
    access_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU5ZGVjNjgxNTkwZGFhM2Q5ZWZmNGI4YSIsInJscyI6MTAwLCJybGgiOjEwMDAsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE1MDgyOTY0MTEsImV4cCI6MTUwODMwMDAxMSwianRpIjoiMjNmOGM0NmYwOWY4Njk4ZWE2ZTVlOWEzMTkzYTZiODI4ZmQwMzBlNSJ9.aFPENvii8KUGbHiXbfd4FU6Yk9y0lIar9fCZw1OgvKU",
    refresh_token: "af5a2bd1468504181fe4269bfc33ef2f39a5597a"
},
    root: 'http://ec2-13-58-126-113.us-east-2.compute.amazonaws.com:3000/'
  },

  github: {
    remote_url: 'ssh://git@github.com/trumpChain/trumpChain.git' //Repo that all new tweets will be pushed
  }
};
