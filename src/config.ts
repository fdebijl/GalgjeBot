import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export const isDev = process.env.NODE_ENV === 'development';

export const CONFIG = {
  /** If game is running in debug mode */
  DEBUG: process.env.DEBUG === 'true',
  /** Game interval in minutes - defaults to 120 */
  GAME_INTERVAL: Number.parseInt((process.env.GAME_INTERVAL as string) ?? '120'),
  /** Time between rounds (i.e. tweets) - defaults to 6 */
  ROUND_INTERVAL: process.env.DEBUG ? 0.5 : Number.parseInt((process.env.ROUND_INTERVAL as string) ?? '6'),
  TWIT_CONFIG: {
    consumer_key: process.env.CONSUMER_KEY as string,
    consumer_secret: process.env.CONSUMER_SECRET as string,
    access_token: process.env.ACCESS_TOKEN as string,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET as string
  },
  /** Minimal length that a word needs to be to be picked - defaults to 3 */
  MIN_WORD_LENGTH: Number.parseInt((process.env.MIN_WORD_LENGTH as string) ?? '3'),
  /** Twitter handle for the bot */
  TWITTER_HANDLE: process.env.TWITTER_HANDLE ?? 'galgjebot',
  /** MongoDB connection string */
  MONGO_URL: isDev ? process.env.MONGO_TEST_URL as string : process.env.MONGO_URL as string,
  /** MongoDB database name */
  MONGO_DB: isDev ? process.env.MONGO_TEST_DB as string : process.env.MONGO_DB as string,
}
