import { isValidStatus } from '../../src/util/isValidStatus';

describe('Valid Status Checker', () => {
  it('Single Letter', () => {
    const input = '@galgjebot a';
    const value = isValidStatus(input);
    const expected = true;

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Single Word', () => {
    const input = '@galgjebot sjon';
    const value = isValidStatus(input);
    const expected = true;

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Non-alphanumeric Single Word', () => {
    const input = '@galgjebot nogwat-deskundige';
    const value = isValidStatus(input);
    const expected = true;

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Multiple Letters', () => {
    const input = '@galgjebot A B C';
    const value = isValidStatus(input);
    const expected = false;

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Multiple Words', () => {
    const input = '@galgjebot dit is een zin met meerdere woorden';
    const value = isValidStatus(input);
    const expected = false;

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });
});