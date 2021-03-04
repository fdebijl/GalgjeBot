/// <reference types="../../" />

import { Game } from '../../src/domain/Game';
import { Guess } from '../../src/domain/Guess';

describe('Guess Letter', () => {
  it('Correct Letter', () => {
    const game = new Game('sjon', 4);
    const input = 's';
    const value = game.guessLetter(input);
    const expected = Guess.RIGHT;

    expect(value)
      .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
      .toEqual(expected);
  });

  it('Unexpected Word, Short', () => {
    const game = new Game('sjon', 4);
    const input = 'sj';
    const value = game.guessLetter(input);
    const expected = Guess.INVALID;

    expect(value)
      .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
      .toEqual(expected);
  });

  it('Unexpected Word, Long', () => {
    const game = new Game('sjon', 4);
    const input = 'sjon';
    const value = game.guessLetter(input);
    const expected = Guess.INVALID;

    expect(value)
      .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
      .toEqual(expected);
  });

  it('Wrong and Repeated Letter', (done) => {
    const game = new Game('sjon', 4);
    const input = 'a';
    const value = game.guessLetter(input);
    const expected = Guess.WRONG;

    expect(value)
      .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
      .toEqual(expected);

    setTimeout(() => {
      const input = 'a';
      const value = game.guessLetter(input);
      const expected = Guess.REPEAT;

      expect(value)
        .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
        .toEqual(expected);

      done();
    }, 1000);
  });
});
