import { getPopularSymbol } from '../../src/logic/getPopularSymbol';

import {
  TEST_STATUSES_VALID_LETTERS,
  TEST_STATUSES_VALID_WORDS,
  TEST_STATUSES_SINGLE_LETTER,
  TEST_STATUSES_SINGLE_WORD,
  TEST_STATUSES_INVALID_MULTILETTERS,
  TEST_STATUSES_INVALID_MULTIWORDS,
  TEST_STATUSES_SOME_VALID_LETTERS,
  TEST_STATUSES_SOME_VALID_WORDS
} from '../fixtures';

describe('Popular Symbol Finder', () => {
  it('Valid Letters', () => {
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

  it('Valid Words', () => {
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

  it('Single Letter', () => {
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

  it('Single Word', () => {
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

  it('Multiple Letters', () => {
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

  it('Multiple Words', () => {
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

  it('Some Valid Letters', () => {
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

  it('Some Valid Words', () => {
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
