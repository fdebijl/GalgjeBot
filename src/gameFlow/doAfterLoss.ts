import moment from 'moment-timezone';

import { clog, LOGLEVEL } from '../util';
import { games, Result } from '../domain';
import { stopGame } from './stopGame';
import { sendUncompiledTweet } from '../twitter';
import { CONFIG } from '../config';


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
