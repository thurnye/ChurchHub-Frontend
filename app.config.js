const { expo } = require('./app.json');

module.exports = {
  expo: {
    ...expo,
    extra: {
      apiBibleKey: process.env.API_BIBLE_KEY,
      bibleApiEndpoint: process.env.BIBLE_API_ENDPOINT,
    },
  },
};
