import { Mog } from '@fdebijl/mog';

import { CONFIG } from '../config';

export const mog = new Mog({
  url: CONFIG.MONGO_URL,
  db: CONFIG.MONGO_DB,
  appName: 'Galgjebot'
});

