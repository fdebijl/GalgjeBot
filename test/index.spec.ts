/// <reference types="../" />

import { games, Game } from '../src/domain/Game';
import { connect } from '../src/db/connect';
import { CONFIG } from '../src/config';

(async () => {
  await connect(CONFIG.MONGO_URL);
  games.current = Game.mock();
})();
