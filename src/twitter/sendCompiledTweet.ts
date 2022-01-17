import { Params } from 'twit';

import { clog, LOGLEVEL } from '../util';
import { CONFIG } from '../config';
import { games, PHASE } from '../domain';
import { T } from './initTwitter';

export const sendCompiledTweet = async (replyToID?: string): Promise<void> => {
  if (!games.current) {
    clog.log('Tried to send a compiled tweet but no game was running!', LOGLEVEL.ERROR);
    return;
  }

  const debugPrefix =
    CONFIG.DEBUG ?
      `DEBUGSESSIE\ngameword: ${games.current.word.join('')}\n` +
      `lg-letter: ${games.current.guessed.letters[games.current.guessed.letters.length -  1]}\n` +
      `lg-word: ${games.current.guessed.words[games.current.guessed.words.length -  1]}\n\n`
      : '';

  // Include previously guessed letters and words
  let previousGuesses = games.current.guessed.letters.length > 0 ? `\n\nGeraden letters:\n${games.current.guessed.letters.join(' ')}` : '';
     previousGuesses += games.current.guessed.words.length > 0 ? `\n\nGeraden woorden:\n${games.current.guessed.words.join(' ')}` : '';

  const gameCount = games.current.gameNumber;
  const params: Params = {
    status: `${debugPrefix}${PHASE[games.current.phase]}\n\n${games.current.out.join(' ')}${previousGuesses}\n\nSpel nr. ${gameCount}`
  }

  if (replyToID) {
    params.in_reply_to_status_id = replyToID;
  }

  T.post('statuses/update', params, async (err, data) => {
    if (err){
      clog.log(`Encountered error when sending tweet: ${err.name}: ${err.message}`, LOGLEVEL.ERROR);
    }

    games.current?.statuses.push(data as ExtendedTweet)
  })
}
