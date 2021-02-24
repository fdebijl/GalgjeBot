import { cleanStatus } from '../../src/util/cleanStatus';

describe('Clean Status', () => {
  it('Single Letter', () => {
    const input = '@galgjebot A';
    const value = cleanStatus(input);
    const expected = 'a';

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Single Word', () => {
    const input = '@galgjebot VeeziEkte';
    const value = cleanStatus(input);
    const expected = 'veeziekte';

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Extra Whitespace w/ Single Letter', () => {
    const input = '@galgjebot    A';
    const value = cleanStatus(input);
    const expected = 'a';

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Non-alphanumeric Single Word', () => {
    const input = '@galgjebot nogwat-deskundige';
    const value = cleanStatus(input);
    const expected = 'nogwatdeskundige';

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Letter w/ Accent', () => {
    const input = '@galgjebot ä';
    const value = cleanStatus(input);
    const expected = 'ä';

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });
});
