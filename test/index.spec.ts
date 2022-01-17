/// <reference types="../" />

import { games, Game } from '../src/domain/Game';

(async () => {
  games.current = Game.mock();
})();
