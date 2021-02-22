import { Game } from '../domain/Game';
import { db } from './connect';

/** Check if the lastest game in the DB was exited before it could be finished */
export const restoreGame = (): Promise<Game | void> => {
  return new Promise((resolve) => {
    db.collection('games').find({}).sort({'gameNumber': -1}).toArray().then(games => {
      if (games && games.length > 0) {
        if ((games[0] as Game).inProgress) {
          resolve(games[0]);
        }
      }

      resolve();
    });
  });
}
