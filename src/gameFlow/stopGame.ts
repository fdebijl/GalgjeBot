import moment from 'moment-timezone';

import { clog, LOGLEVEL } from '../util';
import { roundLoop, setupGame } from '../index';
import { games } from '../domain';
import { CONFIG } from '../config';

export const stopGame = async (): Promise<void> => {
  if (!games.current) {
    clog.log('Tried to stop the game but no game was running!', LOGLEVEL.ERROR);
    return;
  }

  clog.log('Stopping game', LOGLEVEL.DEBUG);
  games.current.inProgress = false;
  games.current.end = moment().tz('Europe/Amsterdam').format();
  await games.current.persist();

  clearInterval(roundLoop);

  // Start the next game in GAME_INTERVAL minutes
  const nextGameTime = moment().tz('Europe/Amsterdam').add(CONFIG.GAME_INTERVAL, 'minutes').format('HH:mm');
  clog.log(`Projected start time for next game is ${nextGameTime}`, LOGLEVEL.INFO);
  setTimeout(() => {
    setupGame();
  }, CONFIG.GAME_INTERVAL * 60 * 1000)
}
