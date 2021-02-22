import { Clog, LOGLEVEL } from '@fdebijl/clog';
import { roundLoop } from '../index';
import { games } from '../domain/Game';

const clog = new Clog();

export const stopGame = async (): Promise<void> => {
  if (!games.current) {
    clog.log('Tried to stop the game but no game was running!', LOGLEVEL.ERROR);
    return;
  }

  clog.log('Stopping game', LOGLEVEL.DEBUG);
  games.current.inProgress = false;
  // Update the DB to reflect that this game has ended
  await games.current.persist();

  clearInterval(roundLoop);
}
