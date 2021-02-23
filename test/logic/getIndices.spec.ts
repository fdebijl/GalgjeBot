import { getIndices } from '../../src/logic/getIndices';

describe('Get Indices', () => {
  it('Simple', () => {
    const input = 'veeziekte';
    const value = getIndices(input, 'e');
    const expected = [1,2,5,8];

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });
});
