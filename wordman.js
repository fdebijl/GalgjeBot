var wordsArray, fs, GAME, CONFIG;

if (typeof module == 'undefined') {
  // Test furnishing and node compatibility shimming
  GAME = {};
  GAME.DIFFICULTY = 6;
  GAME.WORD = "veeziekte".split("");
  GAME.PHASE = 0;
  GAME.GUESSED = {};
  GAME.GUESSED.LETTERS = [];
  GAME.GUESSED.WORDS = [];
  GAME.OUT = [];
} else {
  fs = require('fs');
  GAME = require('./game.js');
  CONFIG = require('./config.js');

  module.exports = {
    guessLetter: guessLetter,
    guessWord: guessWord,
    getPopularSymbol: getPopularSymbol,
    cleanStatus: cleanStatus,
    removeDuplicatesFrom: removeDuplicatesFrom,
    wordsArray: wordsArray,
    getWord: getWord
  }
}

// Add letter to GUESSED array
// returns
//  GUESS_ENUM.REPEAT if letter has already been guessed
//  GUESS_ENUM.WRONG if the guessed letter does not occur in the gameword
//  GUESS_ENUM.RIGHT if the guessed letter DOES occur in the gameword
function guessLetter(letter) {
  if (GAME.GUESSED.LETTERS.indexOf(letter) != -1) {
    return CONFIG.GUESS_ENUM.REPEAT;
  }
  let indices = getIndices(GAME.WORD.join(""), letter), match;

  console.log(`Letter ${letter} got indices ${indices} on word ${GAME.WORD.join("")}`);

  // Push it to guessed letter array as either option (wrong or right) from this point onward constitutes a valid guess
  GAME.GUESSED.LETTERS.push(letter);

  if (indices.length === 0) {
    return CONFIG.GUESS_ENUM.WRONG;
  } else {
    indices.forEach(index => {
      GAME.OUT[index] = GAME.WORD[index];
    });
  }

  return CONFIG.GUESS_ENUM.RIGHT;
}

function guessWord(word) {
  // Return repeated guess if the world has already been guessed in a previous tweet
  if (GAME.GUESSED.WORDS.indexOf(word) != -1) {
    return CONFIG.GUESS_ENUM.REPEAT;
  }

  // If the length of the guessed word doesn't match the length of the game word we wont bother with counting it
  if (GAME.WORD.join("").length != word.length) {
    return CONFIG.GUESS_ENUM.INVALID;
  }

  // Push it to the guessed array as both options from this point onward constitute a valid guess
  GAME.GUESSED.WORDS.push(word);

  // Otherwise check if the word matches
  if (GAME.WORD.join("") == word) {
    GAME.OUT = GAME.WORD;
    return CONFIG.GUESS_ENUM.RIGHT;
  }

  return CONFIG.GUESS_ENUM.WRONG;
}

// Returns all the instances of a letter within a word
function getIndices(word, letter) {
  let indices = [];

  for(let j = 0; j < word.length; j++) {
    if (word[j] == letter) {
      indices.push(j);
    }
  }

  return indices;
}


// Filter input tweets so only actual guesses are counted
// Push all the guesses to an array sorted by 
function getPopularSymbol(statuses, limitToSingleLetter = false) {
  // Start by limiting statuses to those that only contain one word
  statuses = statuses.filter(status => {
    return isValidStatus(status.text);
  });

  if (statuses.length === 0) {
    console.log(`Could not find a valid ${limitToSingleLetter ? "letter" : "word"} in replies`);
    return false;
  }

  // Case: we only have one status
  if (statuses.length === 1) {
    let single = cleanStatus(statuses[0].text);
    if ((limitToSingleLetter && single.length === 1) || (!limitToSingleLetter && single.length > 3)) {
      console.log(`Popular ${limitToSingleLetter ? "letter" : "word"} in replies was ${single}`);
      // gameRound() expects an array from getPopularSymbol, even if we only have a single status.
      return [single];
    }
  }

  // Case: we're dealing with more than one status
  let symbols = [];
  statuses.forEach(status => {
    let cleanedStatus = cleanStatus(status.text);
    // Either we're looking for a letter, in which case the only acceptable length is 1, orrrr
    // We're looking for a word, in which case it should be longer than three characters as per the game rules.
    if ((limitToSingleLetter && cleanedStatus.length === 1) || (!limitToSingleLetter && cleanedStatus.length > 3)) {
      symbols.push(cleanedStatus);
    }
  })

  let popular = [];
  while (symbols.length > 0) {
    let add = findMode(symbols);
    popular.push(add);
    // Remove all instances of the letter we added to $popular from $symbols
    symbols = symbols.filter(symbol => {
      return symbol !== add;
    });
  }

  if (popular) {
    console.log(`Popular ${limitToSingleLetter ? "letters" : "words"} in replies are: ${popular}`);
  } else {
    console.log(`Could not determine a popular ${limitToSingleLetter ? "letter" : "word"} in replies`)
    return false;
  }
  
  return popular;
}

// Clean a status up for processing
// Removes '@galgjebot' and non-alphanumerical characters or spaces
// Output is always lowercased
// Trailing and leading whitespace is removed
function cleanStatus(statusText) {
  let userNameRegEx = new RegExp("@galgjebot", "gi")
  return statusText
    // Remove '@galgjebot'
    .replace(userNameRegEx, '')
    // Remove non-alphanumerical characters, but maintain spaces so we can check for multi-word statuses later, so we can remove them
    .replace(/[^0-9a-zA-ZÀ-ž\s]/gi, '')
    // Lowercase the output for consistent checking, because gameword will always be lowercase aswell
    .toLowerCase()
    // Remove trailing and leading whitespace
    .trim();
}

// A status should either be a single letter or a single word, otherwise we're just not gonna count it
function isValidStatus(statusText) {
  statusText = cleanStatus(statusText);
  // Whether we're checking for letters or words, we don't want to process tweets with more than one word
  if (statusText.split(' ').length > 1) {
    return false;
  }

  return true;
}

function findMode(array) {
  return array.reduce(function(current, item) {
    let val = current.numMapping[item] = (current.numMapping[item] || 0) + 1;
    if (val > current.greatestFreq) {
        current.greatestFreq = val;
        current.mode = item;
    }
    return current;
  }, {mode: null, greatestFreq: -Infinity, numMapping: {}}).mode;
}

function removeDuplicatesFrom(array) {
  let seen = {};
  return array.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

async function getWord() {
  return new Promise((resolve, reject) => {
    if (CONFIG.DEBUG) {
      resolve("sjon");
      return;
    }

    fs.readFile("words.txt", "utf8", function(err, words) {
      let wordsArray = words.split("\n");
      let eligibleWords = [];
  
      console.log(`Looking for word with min length ${GAME.DIFFICULTY} and max length ${GAME.DIFFICULTY + 2}`);
  
      for (let e = 0; e < wordsArray.length; e++) {
        if (wordsArray[e].length >= GAME.DIFFICULTY && wordsArray[e].length <= GAME.DIFFICULTY + 2) {
          eligibleWords.push(wordsArray[e]);
        }
      }
  
      let randomIndex = Math.floor(Math.random() * eligibleWords.length);
  
      // We don't want multi-part words
      while (eligibleWords[randomIndex].split(' ').length > 1) {
        randomIndex = Math.floor(Math.random() * eligibleWords.length);
      }
  
      console.log("Selected random word '" + eligibleWords[randomIndex] + "'")
      resolve(eligibleWords[randomIndex].toLowerCase());
    });
  })
  
}