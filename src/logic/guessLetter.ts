import { Guess } from '../domain/Guess';
import { Game, games } from '../domain/Game'
import { getIndices } from './getIndices';
import { Clog, LOGLEVEL } from '@fdebijl/clog';

const clog = new Clog();

// Add letter to GUESSED array
// returns
//  Guess.REPEAT if letter has already been guessed
//  Guess.WRONG  if the guessed letter does not occur in the gameword
//  Guess.RIGHT  if the guessed letter DOES occur in the gameword
export const guessLetter = (letter: string): Guess => {
  if (!games.current) {
    clog.log('Tried to run letter guess but no game was running!', LOGLEVEL.ERROR);
    return Guess.INVALID;
  }

  if (games.current.guessed.letters.indexOf(letter) != -1) {
    return Guess.REPEAT;
  }

  const indices = getIndices(games.current.word.join(''), letter);

  clog.log(`Letter ${letter} got indices ${indices} on word ${games.current.word.join('')}`, LOGLEVEL.DEBUG);

  // Push it to guessed letter array as either option (wrong or right) from this point onward constitutes a valid guess
  games.current.guessed.letters.push(letter);

  if (indices.length === 0) {
    return Guess.WRONG;
  } else {
    indices.forEach(index => {
      (games.current as Game).out[index] = (games.current as Game).word[index];
    });
  }

  return Guess.RIGHT;
}
