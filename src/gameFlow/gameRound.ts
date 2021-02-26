import { getPopularSymbol } from '../logic/getPopularSymbol';
import { games } from '../domain/Game';
import { Clog, LOGLEVEL } from '@fdebijl/clog';
import { findTweets } from '../twitter/findTweets';
import { runWinLossChecks } from './runWinLossCheck';
import { Guess } from '../domain/Guess';
import { guessWord } from '../logic/guessWord';
import { doAfterVictory } from './doAfterVictory';
import { guessLetter } from '../logic/guessLetter';
import { sendCompiledTweet } from '../twitter/sendCompiledTweet';

const clog = new Clog();

export const gameRound = async (): Promise<void> => {
  if (!games.current) {
    clog.log('Tried to run game round but no game was running!', LOGLEVEL.ERROR);
    return;
  }

  // Gather tweets
  const tweets = await findTweets();
  if (!games.current?.inProgress) {
    clog.log('Game is no longer in progress, aborting round.', LOGLEVEL.WARN);
    return;
  }

  if (!tweets) {
    clog.log('Found no tweets.', LOGLEVEL.DEBUG);
    runWinLossChecks();
    return;
  }

  // Find majority symbol
  const letters = getPopularSymbol(tweets, true);
  const words = getPopularSymbol(tweets);
  let letterIndex = 0;

  if (!letters && !words) {
    clog.log('Tweets were found but none contained single characters or valid words.', LOGLEVEL.DEBUG);
    return;
  }

  let guessStatusWord = Guess.INVALID;
  // Guess only the most popular word
  if ((words as string[])[0] && (words as string[]).length > 0) {
    guessStatusWord = guessWord((words as string[])[0]);
    clog.log(`Processing guess for word ${(words as string[])[0]} and got status ${Guess[guessStatusWord]}`, LOGLEVEL.DEBUG);
  }

  if (guessStatusWord === Guess.RIGHT) {
    doAfterVictory();
    return;
  }

  // A word was guessed but it was wrong, so we increment the phase
  if (guessStatusWord === Guess.WRONG) {
    games.current.phase++;
  } else {
    // If no word was guessed we can process letters instead
    let guessStatusLetter = guessLetter((letters as string[])[letterIndex]);

    // Loop through every letter until we get one that's not been guessed yet
    while (guessStatusLetter === Guess.REPEAT) {
      letterIndex++;

      if (letterIndex >= (letters as string[]).length) {
        clog.log('No unrepeated letter found.', LOGLEVEL.DEBUG);
        break;
      }

      guessStatusLetter = guessLetter((letters as string[])[letterIndex]);
    }

    if (guessStatusLetter === Guess.WRONG) {
      // Wrong letter was guessed
      games.current.phase++;
    }
  }

  // Send the main tweet with the gallow, guessed words and all
  const lastStatus = games.current.statuses[games.current.statuses.length - 1].id_str;
  sendCompiledTweet(lastStatus);

  // Run the win/loss checks to see if the phase has incremented to the point that we lost, or if the last letter guessed completed the word and we won
  runWinLossChecks();

  await games.current.persist();
}
