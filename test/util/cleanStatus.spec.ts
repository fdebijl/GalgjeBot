import { cleanStatus } from '../../src/util/cleanStatus';

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
