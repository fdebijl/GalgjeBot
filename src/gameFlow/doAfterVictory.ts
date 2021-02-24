import { games } from '../domain/Game';
import { Clog, LOGLEVEL } from '@fdebijl/clog';
import { PersistentValueStore } from '../db/persistentValues';
import { stopGame } from './stopGame';
import { findTweets } from '../twitter/findTweets';
import { cleanStatus } from '../util/cleanStatus';
import { removeDuplicatesFrom } from '../util/removeDuplicatesFrom';
import { sendUncompiledTweet } from '../twitter/sendUncompiledTweet';

const clog = new Clog();

export const doAfterVictory = async (): Promise<void> => {
  clog.log('Game won', LOGLEVEL.INFO);

  const secondToLastStatus = await PersistentValueStore.getsecondToLastStatus();
  const tweets = await findTweets(secondToLastStatus);
  const nextGameTime = await PersistentValueStore.getnextGameTime();
  const lastStatus = await PersistentValueStore.getlastStatus();

  if (!tweets || tweets?.length === 0) {
    // Fallback if no tweets are found for whatever reason
    sendUncompiledTweet(`Gewonnen :D\n\nHet woord was: '${games.current?.word.join('')}'\n\nDe volgende ronde start om ${nextGameTime}`, lastStatus);
    return;
  }

  const contributingTweets: ExtendedTweet[] = tweets.filter(tweet => {
    // Only count tweets that added the last correct letter, or the entire word
    return (cleanStatus(tweet.full_text ?? tweet.text as string).substr(0, 1) == games.current?.guessed.letters[games.current.guessed.letters.length - 1] ||
            cleanStatus(tweet.full_text ?? tweet.text as string) == games.current?.guessed.words[games.current?.guessed.words.length - 1]) &&
            tweet.user.screen_name != 'galgjebot';
  });

  // Make sure every user is only counted once
  let users: string[] = [];
  contributingTweets.forEach(tweet => {
    users.push(tweet.user.screen_name);
  });

  users = removeDuplicatesFrom(users);

  let winningPlayers = '';
  users.forEach(user => {
    winningPlayers += `@${user} `;
  })

  sendUncompiledTweet(`Gewonnen :D\n\nHet woord was: '${games.current?.word.join('')}' en is geraden door ${winningPlayers}\n\nDe volgende ronde start om ${nextGameTime}`, lastStatus);

  // Increase difficulty
  let lastDifficulty = await PersistentValueStore.getLastDifficulty();
  lastDifficulty = lastDifficulty - 2;
  await PersistentValueStore.setLastDifficulty(lastDifficulty);

  stopGame();
  return;
}
