/// <reference types="../../" />

import { Game } from '../../src/domain/Game';
import { Guess } from '../../src/domain/Guess';

describe('Guess Word', () => {
  it('Wrong and Repeated Word', (done) => {
    const game = new Game('sjon', 4);
    const input = 'jimi';
    const value = game.guessWord(input);
    const expected = Guess.WRONG;

    expect(value)
      .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
      .toEqual(expected);

    setTimeout(() => {
      const input = 'jimi';
      const value = game.guessWord(input);
      const expected = Guess.REPEAT;

      expect(value)
        .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
        .toEqual(expected);

      done();
    }, 500);
  });

  it('Correct Word', () => {
    const game = new Game('sjon', 4);
    const input = 'sjon';
    const value = game.guessWord(input);
    const expected = Guess.RIGHT;

    expect(value)
      .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
      .toEqual(expected);
  });

  it('Shortest Word, Right', () => {
    const game = new Game('ja', 4);
    const input = 'ja';
    const value = game.guessWord(input);
    const expected = Guess.RIGHT;

    expect(value)
      .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
      .toEqual(expected);
  });

  it('Shortest Word, Wrong', () => {
    const game = new Game('ja', 4);
    const input = 'no';
    const value = game.guessWord(input);
    const expected = Guess.WRONG;

    expect(value)
      .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
      .toEqual(expected);
  });

  it('Long Word', () => {
    const game = new Game('arbeidsongeschiktheidsverzekeringsmaatschappij', 46);
    const input = 'arbeidsongeschiktheidsverzekeringsmaatschappij';
    const value = game.guessWord(input);
    const expected = Guess.RIGHT;

    expect(value)
      .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
      .toEqual(expected);
  });
});
