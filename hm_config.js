require('dotenv').config();

const DEBUG = false;
const GAME_INTERVAL = 120 //minutes;
const ROUND_INTERVAL = DEBUG ? 0.5 : 6 // minutes;
const TWIT_CONFIG = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
};
const MIN_WORD_LENGTH = 3;
const TWITTER_HANDLE = process.env.TWITTER_HANDLE;
const GUESS_ENUM = {
  RIGHT: 0,
  WRONG: 1,
  REPEAT: 2,
  INVALID: 4
};

module.exports = {
  DEBUG: DEBUG,
  GAME_INTERVAL: GAME_INTERVAL,
  ROUND_INTERVAL: ROUND_INTERVAL,
  INITIAL_DIFFICULTY: 6,
  TWIT_CONFIG: TWIT_CONFIG,
  MIN_WORD_LENGTH: MIN_WORD_LENGTH,
  TWITTER_HANDLE: TWITTER_HANDLE,
  GUESS_ENUM: GUESS_ENUM
}