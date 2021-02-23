import { guessLetter } from '../../src/logic/guessLetter';
import { Guess } from '../../src/domain/Guess';

describe('Guess Letter', () => {
  it('Correct Letter', (done) => {
    setTimeout(() => {
      const input = 's';
      const value = guessLetter(input);
      const expected = Guess.RIGHT;

      expect(value)
        .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
        .toEqual(expected);

      done();
    }, 1000);
  });

  it('Wrong and Repeated Letter', (done) => {
    setTimeout(() => {
      const input = 'a';
      const value = guessLetter(input);
      const expected = Guess.WRONG;

      expect(value)
        .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
        .toEqual(expected);

      setTimeout(() => {
        const input = 'a';
        const value = guessLetter(input);
        const expected = Guess.REPEAT;

        expect(value)
          .withContext(`Got '${Guess[value]}', expected '${Guess[expected]}'`)
          .toEqual(expected);

        done();
      }, 1000);
    }, 1000);
  });
});
