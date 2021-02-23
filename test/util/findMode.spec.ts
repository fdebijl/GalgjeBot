import { findMode } from '../../src/util/findMode';

describe('Find Mode', () => {
  it('Pick Mode in Simple Array', () => {
    const input = ['veeziekte', 'veeziekte', 'galgje'];
    const value = findMode(input);
    const expected = 'veeziekte';

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Pick First in Contested Array', () => {
    const input = ['veeziekte', 'galgje', 'veeziekte', 'galgje'];
    const value = findMode(input);
    const expected = 'veeziekte';

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });
});
