/// <reference types="../" />

import { games, Game } from '../src/domain/Game';
import { connect } from '../src/db/connect';
import { CONFIG, isDev } from '../src/config';

(async () => {
  const mongoUrl = isDev ? CONFIG.MONGO_TEST_URL : CONFIG.MONGO_URL;
  await connect(mongoUrl);
  games.current = Game.mock();
})();
