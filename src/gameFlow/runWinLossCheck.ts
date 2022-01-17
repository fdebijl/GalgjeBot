import { games, PHASE } from '../domain';
import { clog, LOGLEVEL } from '../util';
import { doAfterVictory } from './doAfterVictory';
import { checkVictory } from './checkVictory';
import { doAfterLoss } from './doAfterLoss';

export const runWinLossChecks = (): void => {
  if (!games.current) {
    clog.log('Tried to run win/loss checks but no game was running!', LOGLEVEL.ERROR);
    return;
  }

  clog.log(`Checking for loss, game is in phase ${games.current?.phase}, game will be terminated at phase ${PHASE.length}. This currently holds to be: ${games.current?.phase >= PHASE.length - 1}`)
  if (games.current?.phase >= PHASE.length - 1) {
    setTimeout(function() {
      doAfterLoss();
    }, 1000)
  }

  if (checkVictory()) {
    doAfterVictory();
  }
}
