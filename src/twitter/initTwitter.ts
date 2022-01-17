import Twit from 'twit';

import { CONFIG } from '../config';

export let T: Twit;

export const initTwitter = async (): Promise<void> => {
  T = new Twit(CONFIG.TWIT_CONFIG);
  return;
}
