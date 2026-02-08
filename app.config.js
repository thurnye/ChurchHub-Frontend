const { expo } = require('./app.json');

module.exports = {
  expo: {
    ...expo,
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api/v1',
      apiBibleKey: process.env.API_BIBLE_KEY,
      bibleApiEndpoint: process.env.BIBLE_API_ENDPOINT,
    },
  },
};
