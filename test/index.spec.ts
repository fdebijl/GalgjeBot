/// <reference types="../" />

import { cleanStatus } from '../src/util/cleanStatus';
import { isValidStatus } from '../src/util/isValidStatus';
import { getPopularSymbol } from '../src/logic/getPopularSymbol';
import { guessLetter } from '../src/logic/guessLetter';
import { games, Game } from '../src/domain/Game';
import { Guess } from '../src/domain/Guess';
import { connect } from '../src/db/connect';
import { CONFIG } from '../src/config';
import {
  TEST_STATUSES_VALID_LETTERS,
  TEST_STATUSES_VALID_WORDS,
  TEST_STATUSES_SINGLE_LETTER,
  TEST_STATUSES_SINGLE_WORD,
  TEST_STATUSES_INVALID_MULTILETTERS,
  TEST_STATUSES_INVALID_MULTIWORDS,
  TEST_STATUSES_SOME_VALID_LETTERS,
  TEST_STATUSES_SOME_VALID_WORDS
} from './fixtures';

// Setup
(async () => {
  await connect(CONFIG.MONGO_URL);
  games.current = Game.mock();
})();

describe('Clean Status', () => {
  it('Single Letter - CS', () => {
    const input = '@galgjebot A';
    const value = cleanStatus(input);
    const expected = 'a';

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Single Word - CS', () => {
    const input = '@galgjebot VeeziEkte';
    const value = cleanStatus(input);
    const expected = 'veeziekte';

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Extra Whitespace w/ Single Letter - CS', () => {
    const input = '@galgjebot    A';
    const value = cleanStatus(input);
    const expected = 'a';

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Letter w/ Accent - CS', () => {
    const input = '@galgjebot ä';
    const value = cleanStatus(input);
    const expected = 'ä';

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });
});

describe('Valid Status Checker', () => {
  it('Single Letter - VS', () => {
    const input = '@galgjebot a';
    const value = isValidStatus(input);
    const expected = true;

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Single Word - VS', () => {
    const input = '@galgjebot sjon';
    const value = isValidStatus(input);
    const expected = true;

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Multiple Letters - VS', () => {
    const input = '@galgjebot A B C';
    const value = isValidStatus(input);
    const expected = false;

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Multiple Words - VS', () => {
    const input = '@galgjebot dit is een zin met meerdere woorden';
    const value = isValidStatus(input);
    const expected = false;

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });
});

describe('Popular Symbol Finder', () => {
  it('Valid Letters - PSF ', () => {
    const valueLetters = getPopularSymbol(TEST_STATUSES_VALID_LETTERS as unknown as ExtendedTweet[], true);
    const valueWords = getPopularSymbol(TEST_STATUSES_VALID_LETTERS as unknown as ExtendedTweet[]);
    const expectedLetters = ['a', 'c'];
    const expectedWords: string[] = [];

    expect(valueLetters)
      .withContext(`Got letter(s) '${valueLetters}', expected letter(s) '${expectedLetters}'`)
      .toEqual(expectedLetters)

    expect(valueWords)
      .withContext(`Got word(s) '${valueWords}', expected word(s) '${expectedWords}'`)
      .toEqual(expectedWords)
  });

  it('Valid Words - PSF ', () => {
    const valueLetters = getPopularSymbol(TEST_STATUSES_VALID_WORDS as unknown as ExtendedTweet[], true);
    const valueWords = getPopularSymbol(TEST_STATUSES_VALID_WORDS as unknown as ExtendedTweet[]);
    const expectedLetters = ['a'];
    const expectedWords = ['veeziekte', 'wegracer', 'sjon'];

    expect(valueLetters)
      .withContext(`Got letter(s) '${valueLetters}', expected letter(s) '${expectedLetters}'`)
      .toEqual(expectedLetters)

    expect(valueWords)
      .withContext(`Got word(s) '${valueWords}', expected word(s) '${expectedWords}'`)
      .toEqual(expectedWords)
  });

  it('Single Letter - PSF ', () => {
    const valueLetters = getPopularSymbol(TEST_STATUSES_SINGLE_LETTER as unknown as ExtendedTweet[], true);
    const valueWords = getPopularSymbol(TEST_STATUSES_SINGLE_LETTER as unknown as ExtendedTweet[]);
    const expectedLetters = ['a'];
    const expectedWords: string[] = [];

    expect(valueLetters)
      .withContext(`Got letter(s) '${valueLetters}', expected letter(s) '${expectedLetters}'`)
      .toEqual(expectedLetters)

    expect(valueWords)
      .withContext(`Got word(s) '${valueWords}', expected word(s) '${expectedWords}'`)
      .toEqual(expectedWords)
  });

  it('Single Word - PSF ', () => {
    const valueLetters = getPopularSymbol(TEST_STATUSES_SINGLE_WORD as unknown as ExtendedTweet[], true);
    const valueWords = getPopularSymbol(TEST_STATUSES_SINGLE_WORD as unknown as ExtendedTweet[]);
    const expectedLetters: string[] = [];
    const expectedWords = ['veeziekte'];

    expect(valueLetters)
      .withContext(`Got letter(s) '${valueLetters}', expected letter(s) '${expectedLetters}'`)
      .toEqual(expectedLetters)

    expect(valueWords)
      .withContext(`Got word(s) '${valueWords}', expected word(s) '${expectedWords}'`)
      .toEqual(expectedWords)
  });

  it('Multiple Letters - PSF ', () => {
    const valueLetters = getPopularSymbol(TEST_STATUSES_INVALID_MULTILETTERS as unknown as ExtendedTweet[], true);
    const valueWords = getPopularSymbol(TEST_STATUSES_INVALID_MULTILETTERS as unknown as ExtendedTweet[]);
    const expectedLetters = false;
    const expectedWords = false;

    expect(valueLetters)
      .withContext(`Got letter(s) '${valueLetters}', expected letter(s) '${expectedLetters}'`)
      .toEqual(expectedLetters)

    expect(valueWords)
      .withContext(`Got word(s) '${valueWords}', expected word(s) '${expectedWords}'`)
      .toEqual(expectedWords)
  });

  it('Multiple Words - PSF ', () => {
    const valueLetters = getPopularSymbol(TEST_STATUSES_INVALID_MULTIWORDS as unknown as ExtendedTweet[], true);
    const valueWords = getPopularSymbol(TEST_STATUSES_INVALID_MULTIWORDS as unknown as ExtendedTweet[]);
    const expectedLetters = false;
    const expectedWords = false;

    expect(valueLetters)
      .withContext(`Got letter(s) '${valueLetters}', expected letter(s) '${expectedLetters}'`)
      .toEqual(expectedLetters)

    expect(valueWords)
      .withContext(`Got word(s) '${valueWords}', expected word(s) '${expectedWords}'`)
      .toEqual(expectedWords)
  });

  it('Some Valid Letters - PSF ', () => {
    const valueLetters = getPopularSymbol(TEST_STATUSES_SOME_VALID_LETTERS as unknown as ExtendedTweet[], true);
    const valueWords = getPopularSymbol(TEST_STATUSES_SOME_VALID_LETTERS as unknown as ExtendedTweet[]);
    const expectedLetters = ['a', 'b'];
    const expectedWords: string[] = [];

    expect(valueLetters)
      .withContext(`Got letter(s) '${valueLetters}', expected letter(s) '${expectedLetters}'`)
      .toEqual(expectedLetters)

    expect(valueWords)
      .withContext(`Got word(s) '${valueWords}', expected word(s) '${expectedWords}'`)
      .toEqual(expectedWords)
  });

  it('Some Valid Words - PSF ', () => {
    const valueLetters = getPopularSymbol(TEST_STATUSES_SOME_VALID_WORDS as unknown as ExtendedTweet[], true);
    const valueWords = getPopularSymbol(TEST_STATUSES_SOME_VALID_WORDS as unknown as ExtendedTweet[]);
    const expectedLetters: string[] = [];
    const expectedWords = ['rutte'];

    expect(valueLetters)
      .withContext(`Got letter(s) '${valueLetters}', expected letter(s) '${expectedLetters}'`)
      .toEqual(expectedLetters)

    expect(valueWords)
      .withContext(`Got word(s) '${valueWords}', expected word(s) '${expectedWords}'`)
      .toEqual(expectedWords)
  });
});

describe('Guess Parsers', () => {
  it('Correct Letter - GP', (done) => {
    setTimeout(() => {
      const input = 's';
      const value = guessLetter(input);
      const expected = Guess.RIGHT;

      expect(value)
        .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
        .toEqual(expected);

      done();
    }, 500);
  });

  it('Wrong Letter - GP', (done) => {
    setTimeout(() => {
      const input = 'a';
      const value = guessLetter(input);
      const expected = Guess.WRONG;

      expect(value)
        .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
        .toEqual(expected);

      done();
    }, 1500);
  });

  it('Repeated Letter - GP', (done) => {
    setTimeout(() => {
      const input = 'a';
      const value = guessLetter(input);
      const expected = Guess.REPEAT;

      expect(value)
        .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
        .toEqual(expected);

      done();
    }, 2000);
  });
});
