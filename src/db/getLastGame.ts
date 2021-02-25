import { Game } from '../domain/Game';
import { db } from './connect';

export const getLastGame = (): Promise<Game | void> => {
  return new Promise((resolve) => {
    db.collection('games').find({}).sort({'gameNumber': -1}).toArray().then(games => {
      if (games && games.length > 0) {
        resolve(games[0]);
      }

      resolve();
    });
  });
}
