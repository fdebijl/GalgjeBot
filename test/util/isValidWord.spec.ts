import { isValidWord } from '../../src/util/isValidWord';

describe('Valid Word Checker', () => {
  it('No Special Chars', () => {
    const input = 'veeziekte';
    const value = isValidWord(input);
    const expected = true;

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Space', () => {
    const input = 'vee ziekte';
    const value = isValidWord(input);
    const expected = false;

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Dash', () => {
    const input = 'vee-ziekte';
    const value = isValidWord(input);
    const expected = false;

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });
});
