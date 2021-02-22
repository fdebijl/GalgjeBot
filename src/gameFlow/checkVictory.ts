import { games } from '../domain/Game';
import { Clog, LOGLEVEL } from '@fdebijl/clog';

const clog = new Clog();

export const checkVictory = (): boolean => {
  if (!games.current) {
    clog.log('Tried to check for victory but no game was running!', LOGLEVEL.ERROR);
    return false;
  }

  clog.log(`Checking for victory, does ${games.current.out} match gameword ${games.current.word} (t/f)? ${games.current.out == games.current.word}`, LOGLEVEL.DEBUG);
  for (let k = 0; k < games.current.word.length; k++) {
    if (games.current.word[k] != games.current.out[k]) {
      return false;
    }
  }

  clog.log('Victory conditions met.', LOGLEVEL.DEBUG);
  return true;
}
