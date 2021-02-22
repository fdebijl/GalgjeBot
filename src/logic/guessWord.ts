import { Guess } from '../domain/Guess';
import { games } from '../domain/Game'
import { Clog, LOGLEVEL } from '@fdebijl/clog';

const clog = new Clog();

export const guessWord = (word: string): Guess => {
  if (!games.current) {
    clog.log('Tried to run word guess but no game was running!', LOGLEVEL.ERROR);
    return Guess.INVALID;
  }

  // Return repeated guess if the world has already been guessed in a previous tweet
  if (games.current.guessed.words.indexOf(word) != -1) {
    return Guess.REPEAT;
  }

  // If the length of the guessed word doesn't match the length of the game word we wont bother with counting it
  if (games.current.word.join('').length != word.length) {
    return Guess.INVALID;
  }

  // Push it to the guessed array as both options from this point onward constitute a valid guess
  games.current.guessed.words.push(word);

  // Otherwise check if the word matches
  if (games.current.word.join('') == word) {
    games.current.out = games.current.word;
    return Guess.RIGHT;
  }

  return Guess.WRONG;
}
