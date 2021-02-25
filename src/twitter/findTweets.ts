import { games, Game } from '../domain/Game';
import { T } from './initTwitter';
import { Twitter } from 'twit';
import { Clog, LOGLEVEL } from '@fdebijl/clog';

const clog = new Clog();

export const findTweets = async (inReplyTo?: string): Promise<ExtendedTweet[] | false> => {
  return new Promise(async (resolve) => {
    const lastStatus = (games.current as Game).statuses[(games.current as Game).statuses.length - 1].id_str;
    inReplyTo = inReplyTo ? inReplyTo : lastStatus;

    // Search Twitter for tweets directed at the bot account and that match any of our targets.
    T.get('search/tweets', { q: 'to:' + process.env.TWITTER_HANDLE, since_id: lastStatus, result_type: 'recent' }, (err, data) => {
      if (err) {
        clog.log(`Encountered error when searching tweets: ${err.name}: ${err.message}`, LOGLEVEL.ERROR);
        resolve(false);
      }

      if ((data as {statuses: Twitter.Status[]}).statuses.length) {
        const statuses = (data as {statuses: Twitter.Status[]}).statuses.filter(status => {
          return status.in_reply_to_status_id_str == lastStatus;
        })

        // No tweets satify our criteria
        if (statuses.length <= 0) {
          resolve(false);
        }

        resolve(statuses as unknown as ExtendedTweet[]);
      }
    });
  });
}
