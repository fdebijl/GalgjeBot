import { Game } from '../domain/Game';
import { mog } from './mog';

export const getLastGame = async (): Promise<Game | void> => {
  const games = await mog.list<Game>({}, {
    collection: 'games',
    sort: [['gameNumber', 'descending']]
  });

  debugger;

  if (games && games.length > 0) {
    return games[0];
  }

  return;
}
