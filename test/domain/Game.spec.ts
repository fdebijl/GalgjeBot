/// <reference types="../../" />

import { Game } from '../../src/domain/Game';
import { db, connect } from '../../src/db/connect';
import { CONFIG, isDev } from '../../src/config';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

(async () => {
  // Wipe test DB before starting
  const mongoUrl = isDev ? CONFIG.MONGO_TEST_URL : CONFIG.MONGO_URL;
  await connect(mongoUrl);
  if (db.databaseName === 'galgjebottest') {
    await db.collection('games').deleteMany({});
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
