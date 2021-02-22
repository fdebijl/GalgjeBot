import { games } from '../domain/Game';
import { Clog, LOGLEVEL } from '@fdebijl/clog';
import { PersistentValueStore } from '../db/persistentValues';
import { stopGame } from './stopGame';
import { sendUncompiledTweet } from '../twitter/sendUncompiledTweet';

const clog = new Clog();

export const doAfterLoss = async (): Promise<void> => {
  if (!games.current) {
    clog.log('Tried to run after loss procedure but no game was running!', LOGLEVEL.ERROR);
    return;
  }

  clog.log('Game lost', LOGLEVEL.INFO)
  // Game over, set up new game
  const lastStatus = await PersistentValueStore.getlastStatus();
  const nextGameTime = await PersistentValueStore.getnextGameTime();
  sendUncompiledTweet(`Verloren :(\n\nHet woord was '${games.current.word.join('')}'\n\nDe volgende ronde start om ${nextGameTime}`, lastStatus);

  // Reduce difficulty
  let lastDifficulty = await PersistentValueStore.getLastDifficulty();
  lastDifficulty = lastDifficulty + 2;
  await PersistentValueStore.setLastDifficulty(lastDifficulty);

  stopGame();

  return;
}
