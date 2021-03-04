/// <reference types="../../" />

import { Game } from '../../src/domain/Game';
import { getLastGame } from '../../src/db/getLastGame';

describe('Get Last Game', () => {
  it('Restore game', async (done) => {
    const newGame = new Game('sjon', 4);
    await newGame.persist();
    const lastGame = (await getLastGame()) as Game;
    const restoredGame = new Game(lastGame.word.join(''), lastGame?.difficulty, lastGame)

    const value = restoredGame.word;
    const expected = lastGame.word;

    expect(value)
      .withContext(`Got '${value}', expected '${expected}'`)
      .toEqual(expected)

    done();
  });
});