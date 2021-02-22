import { Params } from 'twit';
import { Clog, LOGLEVEL } from '@fdebijl/clog';

import { T } from './initTwitter';

const clog = new Clog();

export const sendUncompiledTweet = (text: string, replyToID: string): void => {
  const params: Params = {
    status: text
  }

  if (replyToID) {
    params.in_reply_to_status_id = replyToID;
  }

  T.post('statuses/update', params, function (err) {
    if (err) {
      clog.log(`Encountered error when searching tweets: ${err.name}: ${err.message}`, LOGLEVEL.ERROR);
    }
  })
}
