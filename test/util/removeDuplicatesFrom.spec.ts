import { removeDuplicatesFrom } from '../../src/util/removeDuplicatesFrom';

describe('Remove Duplicates', () => {
  it('Simple Array', () => {
    const input = ['veeziekte', 'veeziekte', 'galgje'];
    const value = removeDuplicatesFrom(input);
    const expected = ['veeziekte', 'galgje'];

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Tricky Array', () => {
    const input = ['veeziekte', 'galgje', 'veeziekte', 'galgje', 'galgje', 'galgje', 'galgje', 'false'];
    const value = removeDuplicatesFrom(input);
    const expected = ['veeziekte', 'galgje', 'false'];

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });
});
