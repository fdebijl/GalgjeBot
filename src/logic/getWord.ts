import { Clog, LOGLEVEL } from '@fdebijl/clog';
import fs from 'fs';
import { CONFIG } from '../config';
const clog = new Clog();

export const getWord = async (difficulty: number): Promise<string> => {
  return new Promise((resolve) => {
    if (CONFIG.DEBUG) {
      resolve('sjon');
      return;
    }

    fs.readFile('words.txt', 'utf8', (err, words) => {
      const wordsArray = words.split('\n');
      const eligibleWords: string[] = [];

      clog.log(`Looking for word with min length ${difficulty} and max length ${difficulty + 2}`, LOGLEVEL.DEBUG);

      for (let e = 0; e < wordsArray.length; e++) {
        if (wordsArray[e].length >= difficulty && wordsArray[e].length <= difficulty + 2) {
          eligibleWords.push(wordsArray[e]);
        }
      }

      let randomIndex = Math.floor(Math.random() * eligibleWords.length);

      // We don't want multi-part words
      while (eligibleWords[randomIndex].split(' ').length > 1) {
        randomIndex = Math.floor(Math.random() * eligibleWords.length);
      }

      clog.log(`Selected random word '${eligibleWords[randomIndex]}'`, LOGLEVEL.INFO);
      resolve(eligibleWords[randomIndex].toLowerCase());
    });
  })
}
