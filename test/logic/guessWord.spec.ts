import { guessWord } from '../../src/logic/guessWord';
import { Guess } from '../../src/domain/Guess';

describe('Guess Word', () => {
  it('Wrong and Repeated Word', (done) => {
    setTimeout(() => {
      const input = 'jimi';
      const value = guessWord(input);
      const expected = Guess.WRONG;

      expect(value)
        .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
        .toEqual(expected);

      setTimeout(() => {
        const input = 'jimi';
        const value = guessWord(input);
        const expected = Guess.REPEAT;

        expect(value)
          .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
          .toEqual(expected);

        done();
      }, 500);
    }, 500);
  });

  it('Correct Word', (done) => {
    setTimeout(() => {
      const input = 'sjon';
      const value = guessWord(input);
      const expected = Guess.RIGHT;

      expect(value)
        .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
        .toEqual(expected);

      done();
    }, 2000);
  });
});
