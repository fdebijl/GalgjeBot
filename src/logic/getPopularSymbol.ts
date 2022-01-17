import { clog, LOGLEVEL, cleanStatus, isValidStatus, findMode } from '../util';
import { CONFIG } from '../config';

// Filter input tweets so only actual guesses are counted
export const getPopularSymbol = (statuses: ExtendedTweet[], limitToSingleLetter = false): boolean | string[] => {
  // Start by limiting statuses to those that only contain one word
  statuses = statuses.filter(status => {
    return isValidStatus(status.full_text || status.text);
  });

  if (statuses.length === 0) {
    clog.log(`Could not find a valid ${limitToSingleLetter ? 'letter' : 'word'} in replies`, LOGLEVEL.DEBUG);
    return false;
  }

  // Case: we only have one status
  if (statuses.length === 1) {
    const single = cleanStatus(statuses[0].text as string);
    if ((limitToSingleLetter && single.length === 1) || (!limitToSingleLetter && single.length > CONFIG.MIN_WORD_LENGTH)) {
      clog.log(`Popular ${limitToSingleLetter ? 'letter' : 'word'} in replies was ${single}`, LOGLEVEL.DEBUG);
      // gameRound() expects an array from getPopularSymbol, even if we only have a single status.
      return [single];
    }
  }

  // Case: we're dealing with more than one status
  let symbols: string[] = [];
  statuses.forEach(status => {
    const cleanedStatus = cleanStatus(status.text as string);
    // Either we're looking for a letter, in which case the only acceptable length is 1, orrrr
    // We're looking for a word, in which case it should be longer than three characters as per the game rules.
    if ((limitToSingleLetter && cleanedStatus.length === 1) || (!limitToSingleLetter && cleanedStatus.length > CONFIG.MIN_WORD_LENGTH)) {
      symbols.push(cleanedStatus);
    }
  })

  const popular = [];
  while (symbols.length > 0) {
    const add = findMode(symbols);
    popular.push(add as string);
    // Remove all instances of the letter we added to $popular from $symbols
    symbols = symbols.filter(symbol => {
      return symbol !== add;
    });
  }

  if (popular) {
    clog.log(`Popular ${limitToSingleLetter ? 'letters' : 'words'} in replies are: ${popular}`, LOGLEVEL.DEBUG);
  } else {
    clog.log(`Could not determine a popular ${limitToSingleLetter ? 'letter' : 'word'} in replies`, LOGLEVEL.DEBUG);
    return false;
  }

  return popular;
}
