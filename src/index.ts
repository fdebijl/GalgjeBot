import moment from 'moment-timezone';
import { Clog } from '@fdebijl/clog';

import { CONFIG } from './config';
import { initTwitter } from './twitter/initTwitter';
import { games, Game } from './domain/Game';
import { getWord } from './logic/getWord';
import { PHASE } from './domain/Phase';
import { connect } from './db/connect';
import { PersistentValueStore } from './db/persistentValues';
import { sendCompiledTweet } from './twitter/sendCompiledTweet';
import { gameRound } from './gameFlow/gameRound';
import { restoreGame } from './db/restoreGame';

const clog = new Clog();

// Export the round loop so it can be terminated from the game end routine
export let roundLoop: NodeJS.Timeout;

// Setup a single game
const setupGame = async (restoreFromDB = false, restoredGame?: Game): Promise<void> => {
  const nextGameTime = moment().tz('Europe/Amsterdam').add(CONFIG.GAME_INTERVAL, 'm').format('HH:mm');
  await PersistentValueStore.setnextGameTime(nextGameTime);

  if (restoreFromDB && restoredGame) {
    games.current = new Game(restoredGame.word.join(''), restoredGame?.difficulty, restoredGame);
    clog.log(`Restoring game no. ${games.current.gameNumber} from DB - next one is scheduled to start at ${nextGameTime}`)

    // Continue the game by issuing a game round
    gameRound();
  } else {
    const lastDifficulty = await PersistentValueStore.getLastDifficulty();
    const difficulty = lastDifficulty >= CONFIG.MIN_WORD_LENGTH ? lastDifficulty : CONFIG.MIN_WORD_LENGTH;
    const selectedWord = await getWord(difficulty);
    games.current = new Game(selectedWord, difficulty)
    games.current.phase = CONFIG.DEBUG ? PHASE.length - 2 : 0;

    setTimeout(() => {
      // Send out the first tweet
      // This is inside a small timeout to ensure the gameNumber is retrieved properly
      clog.log(`Set up new game with number ${(games.current as Game).gameNumber} - next one is scheduled to start at ${nextGameTime}`);
      sendCompiledTweet();
    }, 500)
  }

  // Start round loop interval
  // Execute a round with full game rules every X minutes
  roundLoop = setInterval(function() {
    gameRound();
  }, CONFIG.ROUND_INTERVAL * 60 * 1000)
}

// Start a game on first boot
(async () => {
  await connect(CONFIG.MONGO_URL);
  await initTwitter();
  const restoredGame = await restoreGame();
  if (restoredGame) {
    setupGame(true, restoredGame);
  } else {
    setupGame();
  }


  // Main loop - start a game every X minutes
  setInterval(async () => {
    if (games?.current?.inProgress) {
      const nextGameTime = moment().tz('Europe/Amsterdam').add(CONFIG.GAME_INTERVAL, 'm').format('HH:mm');
      await PersistentValueStore.setnextGameTime(nextGameTime);
      clog.log(`Game is already in progress, waiting one cycle to start a new one. Projected start date is ${nextGameTime}`)
      return;
    }

    setupGame();
  }, CONFIG.GAME_INTERVAL * 60 * 1000);
})();
