import { games } from '../domain/Game';
import { Result } from '../domain/Result';
import { Clog, LOGLEVEL } from '@fdebijl/clog';
import { stopGame } from './stopGame';
import { sendUncompiledTweet } from '../twitter/sendUncompiledTweet';

import moment from 'moment-timezone';
import { CONFIG } from '../config';

const clog = new Clog();

export const doAfterLoss = async (): Promise<void> => {
  if (!games.current) {
    clog.log('Tried to run after loss procedure but no game was running!', LOGLEVEL.ERROR);
    return;
  }

  clog.log('Game lost', LOGLEVEL.INFO)
  const lastStatus = games.current.statuses[games.current.statuses.length - 1].id_str;
  const nextGameTime = moment().tz('Europe/Amsterdam').add(CONFIG.GAME_INTERVAL, 'minutes').format('HH:mm');
  sendUncompiledTweet(`Verloren :(\n\nHet woord was '${games.current.word.join('')}'\n\nDe volgende ronde start om ${nextGameTime}`, lastStatus);

  games.current.result = Result.LOSS

  stopGame();

  return;
}
