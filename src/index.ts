import moment from 'moment-timezone';
import { Clog, LOGLEVEL } from '@fdebijl/clog';

import { CONFIG, isDev } from './config';
import { initTwitter } from './twitter/initTwitter';
import { games, Game } from './domain/Game';
import { getWord } from './logic/getWord';
import { PHASE } from './domain/Phase';
import { connect } from './db/connect';
import { sendCompiledTweet } from './twitter/sendCompiledTweet';
import { gameRound } from './gameFlow/gameRound';
import { getLastGame } from './db/getLastGame';
import { Result } from './domain/Result';

const clog = new Clog();

// Export the round loop so it can be terminated from the game end routine
export let roundLoop: NodeJS.Timeout;

// Setup a single game
export const setupGame = async (restoreFromDB = false, restoredGame?: Game): Promise<void> => {
  if (restoreFromDB && restoredGame) {
    games.current = new Game(restoredGame.word.join(''), restoredGame?.difficulty, restoredGame);
    clog.log(`Restoring game no. ${games.current.gameNumber} from DB`)

    // Continue the game by issuing a game round
    gameRound();
  } else {
    const lastGame = await getLastGame()
    let nextDifficulty = lastGame ? lastGame.difficulty : 6;
    nextDifficulty = (lastGame as Game).result === Result.WIN ? nextDifficulty - 2 : nextDifficulty + 2;
    const difficulty = nextDifficulty >= CONFIG.MIN_WORD_LENGTH ? nextDifficulty : CONFIG.MIN_WORD_LENGTH;
    const selectedWord = await getWord(difficulty);
    games.current = new Game(selectedWord, difficulty)
    games.current.phase = CONFIG.DEBUG ? PHASE.length - 2 : 0;

    setTimeout(() => {
      // Send out the first tweet
      // This is inside a small timeout to ensure the gameNumber is retrieved properly
      clog.log(`Set up new game with number ${(games.current as Game).gameNumber}`);
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
  const mongoUrl = isDev ? CONFIG.MONGO_TEST_URL : CONFIG.MONGO_URL;
  await connect(mongoUrl);
  await initTwitter();

  const lastGame = await getLastGame();
  if (lastGame) {
    if (lastGame.inProgress) {
      setupGame(true, lastGame);
    } else {
      // Check if we should wait to start the new game
      const nextGameTime = moment(lastGame.end).add(CONFIG.GAME_INTERVAL, 'minutes');
      const now = moment();
      if (now.isBefore(nextGameTime, 'minutes') && lastGame.end) {
        // We haven't passed the nextGameTime so we need to wait before setting up a new game
        const diff = Math.abs(now.diff(nextGameTime, 'milliseconds')) + 5000;
        clog.log(`Waiting ${diff / 1000} seconds before starting a new game to comply with next game time`, LOGLEVEL.INFO);
        setTimeout(() => {
          setupGame();
        }, diff)
      } else {
        // We are past the nextGameTime so we are cleared to start a new one
        clog.log('Ready to start new game, past next game time', LOGLEVEL.DEBUG);
        setupGame();
      }
    }
  } else {
    setupGame();
  }
})();
