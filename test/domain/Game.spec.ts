/// <reference types="../../" />

import { Game } from '../../src/domain/Game';
import { db, connect } from '../../src/db/connect';
import { getLastGame } from '../../src/db/getLastGame';
import { CONFIG, isDev } from '../../src/config';

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

  it('Restore game', (done) => {
    setTimeout(async () => {
      const lastGame = (await getLastGame()) as Game;
      const restoredGame = new Game(lastGame.word.join(''), lastGame?.difficulty, lastGame)

      const value = restoredGame.word;
      const expected = lastGame.word;

      expect(value)
        .withContext(`Got '${value}', expected '${expected}'`)
        .toEqual(expected)

      done();
    }, 5000)
  });
});
