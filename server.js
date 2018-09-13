/* Setting things up. */
require('dotenv').config();

const fs = require('fs'),
      path = require('path'),
      Twit = require('twit'),
      moment = require('moment-timezone');


const TWIT_CONFIG = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
};

const T = new Twit(TWIT_CONFIG);

const DEBUG = false;
const GAME_INTERVAL = 120 //minutes;
const ROUND_INTERVAL = 6;
const GUESS_ENUM = {
  RIGHT: 0,
  WRONG: 1,
  REPEAT: 2,
  EMPTY: 4
}
const PHASE = [
`





|`,
`



|
|
|`,
`
|
|
|
|
|
|`,
`_________
|         |
|
|
|
|
|`,
`_________
|         |
|         0
|
|
|
|`,
`_________
|         |
|         0
|        /|\\
|
|
|`,
`_________
|         |
|         0
|        /|\\
|        / \\
|
|   RIP`
]


// Instances global variables
var inProgress = false;
var lastDifficulty = 6;
var postponeCount = 0;
const GAME = {
  WORD: "",
  PHASE: 0,
  GUESSED: [],
  OUT: [],
  DIFFICULTY: 0
}

// Empty global variables
let wordsArray, gameCount, nextGameTime, lastStatus, secondToLastStatus;

// Start a game on first boot;
setupGame();

// Main loop - start a game every X minutes
let mainLoop = setInterval(function() {
  if (inProgress) {
    if (postponeCount > 3) {
      stopGame();

      setTimeout(function(){
        setupGame();
        postponeCount = 0;
      }, 5000)
    }
    nextGameTime = moment().tz("Europe/Amsterdam").add(GAME_INTERVAL, 'm').format('HH:MM');
    console.log("Game is already in progress, waiting one cycle to start a new one. Projected start date is " + nextGameTime)
    postponeCount++;
    return;
  }

  setupGame();
}, GAME_INTERVAL * 60 * 1000);

// This will be populated later and will contain the loop for executing a round
let roundLoop;

// Setup a single game
function setupGame() {
  nextGameTime = moment().tz("Europe/Amsterdam").add(GAME_INTERVAL, 'm').format('HH:MM');
  console.log("Setting up game - next one is scheduled to start at " + nextGameTime);
  inProgress = true;

  fs.readFile("words.txt", "utf8", function(err, words) {
    wordsArray = words.split("\n");

    // Word length must be atleast 3
    GAME.DIFFICULTY = lastDifficulty >= 3 ? lastDifficulty : 3;
    GAME.WORD = getWord().split("");
    GAME.PHASE = 0;
    GAME.GUESSED = [];
    GAME.OUT = [];

    // Start with underscores for the word display in the tweet
    for(let i = 0; i < GAME.WORD.length; i++) {
      GAME.OUT.push("_");
    }

    fs.readFile("gamecount.txt", "utf8", function(err, count) {
      gameCount = count;
      
      // Send out the first tweet
      sendCompiledTweet();

      // Start round loop interval
      // Execute a round with full game rules every X minutes
      roundLoop = setInterval(function() {
        gameRound();
      }, ROUND_INTERVAL * 60 * 1000)
    });
  });
}

function stopGame() {
  console.log("Stopping game...");
  inProgress = false;
  gameCount++;
  clearInterval(roundLoop);

  fs.writeFile(__dirname + '/gamecount.txt', gameCount, function (err) {
    if(err){
      console.log('Error!', err);
    }
  });
}

// Add letter to GUESSED array
// returns false if letter doesn't occurr
function guessLetter(letter) {
  if (GAME.GUESSED.indexOf(letter) != -1) {
    return GUESS_ENUM.REPEAT;
  }
  let indices = getIndices(GAME.WORD.join(""), letter), match;

  console.log(`Letter ${letter} got indices ${indices} on word ${GAME.WORD.join("")}`);

  if (indices.length === 0) {
    return GUESS_ENUM.WRONG;
  } else {
    indices.forEach(index => {
      GAME.OUT[index] = GAME.WORD[index];
    });
  }

  return GUESS_ENUM.RIGHT;
}

function guessWord(word) {
  if (GAME.WORD.join("") == word) {
    GAME.OUT = GAME.WORD;
    return GUESS_ENUM.RIGHT;
  }

  return GUESS_ENUM.WRONG;
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

function checkVictory() {
  console.log(`Checking for victory, does ${GAME.OUT} match gameword ${GAME.WORD} (t/f)? ${GAME.OUT == GAME.WORD}`);
  for (let k = 0; k < GAME.WORD.length; k++) {
    if (GAME.WORD[k] != GAME.OUT[k]) return false;
  }

  console.log("Victory conditions met.");
  return true;
}

async function findTweets(inReplyTo) {
  return new Promise((resolve, reject) => {
    inReplyTo = inReplyTo ? inReplyTo : lastStatus;

    // Search Twitter for tweets directed at the bot account and that match any of our targets.
    T.get('search/tweets', { q: 'to:' + process.env.TWITTER_HANDLE, since_id: lastStatus, result_type: "recent" }, function(err, data, response) {
      if (err) {
        console.log('Error!', err);
        resolve(false);
      }

      if (data.statuses.length) {
        let statuses = data.statuses.filter(status => {
          return status.in_reply_to_status_id == lastStatus;
        })

        // No tweets satify our criteria
        if (statuses.length <= 0) {
          resolve(false);
        }

        resolve(statuses);
      }
    });    
  });
}

function getPopularSymbol(statuses, limitToSingleLetter) {
  if (statuses.length === 1) {
    let single = cleanStatus(statuses[0].text);

    // If we're checking for letter we'll only return if the status is actually a single letter
    if (!limitToSingleLetter && single.length < 2) {
      return false;
    }

    console.log("Popular symbol in replies was " + single);
    return [single];
  }

  let symbols = [];
  statuses.forEach(status => {
    let cleanedStatus = cleanStatus(status.text);
    if (limitToSingleLetter && cleanedStatus.length < 2) {
      symbols.push(cleanedStatus);
    } else {
      // Words must be longer than 1 char
      if (cleanedStatus.length > 1) {
        console.log("Pushing word to symbol array: " + cleanedStatus)
        symbols.push(cleanedStatus);
      }
    }
  })

  let popular = [];
  while (symbols.length > 0) {
    let add = findMode(symbols);
    popular.push(add);
    // Remove all instances of the letter we added to popular from symbols
    symbols = symbols.filter(symbol => {
      symbol !== add;
    });
  }

  console.log("Popular words: " + popular);
  return popular;
}

function cleanStatus(statusText) {
  return statusText.replace("@" + process.env.TWITTER_HANDLE, '').trim().split(' ')[0].replace(/[^0-9a-zÀ-ž]/gi, '').toLowerCase();
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

function getWord() {
  if (DEBUG) {
    return "sjon";
  }
  
  let eligibleWords = [];

  console.log(`Looking for word with min length ${GAME.DIFFICULTY} and max length ${GAME.DIFFICULTY + 2}`);

  for (let e = 0; e < wordsArray.length; e++) {
    if (wordsArray[e].length >= GAME.DIFFICULTY && wordsArray[e].length <= GAME.DIFFICULTY + 2) {
      eligibleWords.push(wordsArray[e]);
    }
  }

  let randomIndex = Math.floor(Math.random() * eligibleWords.length);
  console.log("Selected random word '" + eligibleWords[randomIndex] + "'")
  return eligibleWords[randomIndex].toLowerCase();
}

function sendCompiledTweet(replyToID) {
  let debugPrefix = DEBUG ? `DEBUGESSIE\ngameword ${GAME.WORD.join("")}\nlastguess ${GAME.GUESSED[GAME.GUESSED.length -  1]}\n\n` : ``;

  let params = { 
    status: `${debugPrefix}${PHASE[GAME.PHASE]}\n\n${GAME.OUT.join(" ")}\n\nGeraden letters:\n${GAME.GUESSED.join(" ")}\n\nSpel nr. ${gameCount}`
  }

  if (replyToID) {
    params.in_reply_to_status_id = replyToID;
  }
  
  T.post('statuses/update', params, function (err, data, response) {
    if (err){
      console.log('Error!', err);
    }

    secondToLastStatus = lastStatus;
    lastStatus = data.id_str;
  })
}

function sendUncompiledTweet(text, replyToID) {
  let params = { 
    status: text
  }

  if (replyToID) {
    params.in_reply_to_status_id = replyToID;
  }
  
  T.post('statuses/update', params, function (err, data, response) {
    if (err){
      console.log('Error!', err);
    }
    
    return true;
  })
}

function gameRound() {
  // Gather tweets
  findTweets()
    .then(tweets => {
      if (!tweets) {
        console.log("Found no tweets.");
        runWinLossChecks()
        return;
      }

      if (!inProgress) {
        console.log("Game is no longer in progress, aborting round.");
        return;
      }

      // Find majority symbol
      let letters = getPopularSymbol(tweets, true), letterIndex = 0;
      let words = getPopularSymbol(tweets);

      if (!letters && !words) {
        console.log("Tweets were found but none contained single characters or valid words.")
        return;
      }

      console.log("Got words: " + words);

      let guessStatusWord = GUESS_ENUM.EMPTY;
      // Guess only the most popular word
      if (words[0] && words.length > 0) {
        guessStatusWord = guessWord(words[0]);
        console.log("Processing guess for word " + words[0] + " and got status " + guessStatusWord)
      }

      if (guessStatusWord === GUESS_ENUM.RIGHT) {
        // We won
        sendCompiledTweet(lastStatus);

        // Send the post-game stats after 15 seconds
        setTimeout(function() {
          doAfterVictory(); 
        }, 15000)
      }

      let guessStatusLetter = guessLetter(letters[letterIndex]);

      // Loop through every letter until we get one that's not been guessed yet
      while (guessStatusLetter === GUESS_ENUM.REPEAT) {
        letterIndex++;

        if (letterIndex >= letters.length) {
          console.log("No unrepeated letter found.");
          return;
        } 

        guessStatusLetter = guessLetter(letters[letterIndex]);
      }

      // A word was guessed but it was wrong, so we increment the phase
      if (guessStatusWord === GUESS_ENUM.WRONG) {
        GAME.PHASE++;
      } else {
        // No word was guessed so we just push the letter to the guessed array and increment the phase
        GAME.GUESSED.push(letters[letterIndex]);

        if (guessStatusLetter === GUESS_ENUM.WRONG) {
          // False letter was guessed
          GAME.PHASE++;
        }
      }

      // Send the main tweet with the gallow, guessed words and all
      sendCompiledTweet(lastStatus);

      runWinLossChecks();
  });
}

function runWinLossChecks() {
  // Check if we lost
  if (GAME.PHASE === PHASE.length) {
    doAfterLoss();
  }

  // Check if we won
  if (checkVictory()) {
    doAfterVictory(); 
  }
}

function doAfterVictory() {
  console.log("Game won");

  // Find everyone who contributed to the victory
  findTweets(secondToLastStatus)
  .then(tweets => {
    tweets = tweets.filter(tweet => {
      // Only count tweets that added the last correct letter or the entire word
      return (cleanStatus(tweet.text).substr(0, 1) === GAME.GUESSED[GAME.GUESSED.length - 1] || cleanStatus(tweet.text) == GAME.WORD.join("")) && tweet.user.screen_name != "galgjebot";
    });

    // Make sure every user is only counted once
    let users = [];
    tweets.forEach(tweet => {
      users.push(tweet.user.screen_name);
    });
    users = removeDuplicatesFrom(users);

    let winningPlayers = "";
    users.forEach(user => {
      winningPlayers += "@";
      winningPlayers += user;
      winningPlayers += " ";
    })
    
    sendUncompiledTweet(`Gewonnen :D\n\nHet woord was: '${GAME.WORD.join("")}' en is geraden door ${winningPlayers}\n\nDe volgende ronde start om ${nextGameTime}\n\n`, lastStatus);

    lastDifficulty = lastDifficulty - 2;
    stopGame();
    return;
  })

  return;
}

function doAfterLoss() {
  console.log("Game lost")
  // Game over, set up new game
  sendUncompiledTweet(`Verloren :(\n\nHet woord was '${GAME.WORD.join("")}'\n\nDe volgende ronde start om ${nextGameTime}`, lastStatus);
  stopGame();
  lastDifficulty = lastDifficulty + 2;

  return;
}