/// <reference types="../../" />

import { Game } from '../../src/domain/Game';
import { mog } from '../../src/db';
import { CONFIG, isDev } from '../../src/config';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

(async () => {
  if (mog.db.databaseName === 'galgjebottest') {
    await mog.delete({}, { collection: 'games' });
  }
})();

describe('Game Registry', () => {
  it('Word is split into array', () => {
    const game = new Game('sjon', 4);
    const value = game.word;
    const expected = ['s','j','o','n']

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Out array is populated', () => {
    const game = new Game('sjon', 4);
    const value = game.out;
    const expected = ['_','_','_','_']

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)
  });

  it('Set gamenumber for first and second game', (done) => {
    setTimeout(async () => {
      const game = new Game('sjon', 4);
      const value = game.gameNumber;
      const expected = 1;
      await game.persist();

      expect(value)
        .withContext(`Got '${value}', expected '${expected}'`)
        .toEqual(expected)

      setTimeout(async () => {
        const game = new Game('sjon', 4);
        setTimeout(() => {
          const value = game.gameNumber;
          const expected = 2;

          expect(value)
            .withContext(`Got '${value}', expected '${expected}'`)
            .toEqual(expected)

          done();
        }, 1000)
      }, 1000)
    }, 1000)
  });
});
