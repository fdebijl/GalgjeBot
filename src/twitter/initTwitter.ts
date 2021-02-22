import { CONFIG } from '../config';
import Twit from 'twit';

export let T: Twit;

export const initTwitter = async (): Promise<void> => {
  T = new Twit(CONFIG.TWIT_CONFIG);
  return;
}
