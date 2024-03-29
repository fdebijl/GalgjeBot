import moment from 'moment-timezone';

import { clog, LOGLEVEL } from '../util';
import { getLastGame, mog } from '../db';
import { Result } from './Result';
import { Guess } from './Guess';
import { getIndices } from '../logic';

export class Game {
  /** The word that players have to guess this game. The letters in this word are split into an array for easy processing. */
  public word: string[];
  /** Current phase of the game. For each wrong guess this is incremented by one, effectively building the gallow. */
  public phase: number;
  /** Previously guessed letters and words this game. */
  public guessed: {
    letters: string[];
    words: string[];
  } = {letters: [], words: []}
  /** Display of blank slots or correctly guessed letters */
  public out: string[];
  /** Difficulty for this game (i.e. the maximal word length - shorter words are generally harder). */
  public difficulty: number;
  /** Whether the game is currently in progress. No game should be started while one is already in progress. */
  public inProgress: boolean;
  /** Number for this game */
  public gameNumber: number;
  /** Statuses that the bot has posted as part of this game */
  public statuses: ExtendedTweet[];
  /** Start time of this game, ISO 8601 string generated by moment */
  public start: string;
  /** End time of this game, ISO 8601 string generated by moment */
  public end: string;
  /** Result of this game, win or loss */
  public result: Result;

  constructor(word: string, difficulty: number, restoredGame?: Game) {
    if (restoredGame) {
      this.word = word.split('');
      this.phase = restoredGame.phase;
      this.guessed = restoredGame.guessed;
      this.out = restoredGame.out;
      this.difficulty = restoredGame.difficulty;
      this.inProgress = restoredGame.inProgress;
      this.gameNumber = restoredGame.gameNumber;
      this.statuses = restoredGame.statuses;
      this.start = restoredGame.start;
      this.end = restoredGame.end;
      this.result = restoredGame.result;
    } else {
      this.word = word.split('');
      this.phase = 0;
      this.guessed.letters = [];
      this.guessed.words = [];
      this.out = [];
      this.difficulty = difficulty;
      this.inProgress = true;
      this.statuses = [];
      this.start = moment().tz('Europe/Amsterdam').format();
      this.end = '';
      this.result = Result.RUNNING;

      // Start with underscores for the word display in the tweet
      for (let i = 0; i < this.word.length; i++) {
        this.out.push('_');
      }

      // Fallback game number
      this.gameNumber = 1;
      getLastGame().then(game => {
        if (game) {
          this.gameNumber = game.gameNumber + 1;
        }
      });
    }
  }

  async persist(): Promise<void> {
    const query = { gameNumber: this.gameNumber };
    const update = {
      word: this.word,
      phase: this.phase,
      guessed: this.guessed,
      out: this.out,
      difficulty: this.difficulty,
      inProgress: this.inProgress,
      gameNumber: this.gameNumber,
      statuses: this.statuses,
      start: this.start,
      end: this.end,
      result: this.result
    };
    const options = { collection: 'games', upsert: true };

    await mog.update(query, update, options);
    return;
  }

  guessWord(word: string): Guess {
    // Return repeated guess if the world has already been guessed in a previous tweet
    if (this.guessed.words.indexOf(word) != -1) {
      return Guess.REPEAT;
    }

    // If the length of the guessed word doesn't match the length of the game word we wont bother with counting it
    if (this.word.join('').length != word.length) {
      return Guess.INVALID;
    }

    // Push it to the guessed array as both options from this point onward constitute a valid guess
    this.guessed.words.push(word);

    // Otherwise check if the word matches
    if (this.word.join('') == word) {
      this.out = this.word;
      return Guess.RIGHT;
    }

    return Guess.WRONG;
  }

  guessLetter(letter: string): Guess {
    if (letter.length > 1) {
      return Guess.INVALID;
    }

    if (this.guessed.letters.indexOf(letter) != -1) {
      return Guess.REPEAT;
    }

    const indices = getIndices(this.word.join(''), letter);

    clog.log(`The letter ${letter} got ${indices.length > 0 ? `indices ${indices}` : 'no indices'} on word ${this.word.join('')}`, LOGLEVEL.DEBUG);

    // Push it to guessed letter array as either option (wrong or right) from this point onward constitutes a valid guess
    this.guessed.letters.push(letter);

    if (indices.length === 0) {
      return Guess.WRONG;
    } else {
      indices.forEach(index => {
        this.out[index] = this.word[index];
      });
    }

    return Guess.RIGHT;
  }


  static mock(): Game {
    return new Game('sjon', 6);
  }
}

// We use this object as a namespaces, since top-level exports can't be mutated - this way we can overwrite games.current
export const games: {
  current: Game | undefined;
  previous: Game | undefined;
} = {
  current: undefined,
  previous: undefined
}
