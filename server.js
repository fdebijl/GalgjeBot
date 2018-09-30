require('dotenv').config();

// Libs
const fs = require('fs'),
      path = require('path'),
      Twit = require('twit'),
      moment = require('moment-timezone');

// Private libs
const WordMan = require('./wordman.js');
const GAME = require('./game.js');
const CONFIG = require('./config.js')

// Configuration
const T = new Twit(CONFIG.TWIT_CONFIG);
WordMan.DEBUG = CONFIG.DEBUG;
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

// Instantiated global variables
var lastDifficulty = 6;

// Empty global variables we'll need later on
let gameCount, nextGameTime, lastStatus, secondToLastStatus;

// Start a game on first boot;
setupGame();

// Main loop - start a game every X minutes
let mainLoop = setInterval(function() {
  if (GAME.IN_PROGRESS) {
    nextGameTime = moment().tz("Europe/Amsterdam").add(CONFIG.GAME_INTERVAL, 'm').format('LT');
    console.log("Game is already in progress, waiting one cycle to start a new one. Projected start date is " + nextGameTime)
    return;
  }

  setupGame();
}, CONFIG.GAME_INTERVAL * 60 * 1000);

// This will be populated later and will contain the loop for executing a round
let roundLoop;

// Setup a single game
function setupGame() {
  nextGameTime = moment().tz("Europe/Amsterdam").add(CONFIG.GAME_INTERVAL, 'm').format('HH:MM');
  console.log("Setting up game - next one is scheduled to start at " + nextGameTime);
  GAME.IN_PROGRESS = true;

  // Word length must be atleast 3 (check config.js)
  GAME.DIFFICULTY = lastDifficulty >= CONFIG.MIN_WORD_LENGTH ? lastDifficulty : CONFIG.MIN_WORD_LENGTH;
  WordMan.getWord().then(selectedWord => {
    GAME.WORD = selectedWord.split("");
    GAME.PHASE = CONFIG.DEBUG ? PHASE.length - 2 : 0;
    GAME.GUESSED.LETTERS = [];
    GAME.GUESSED.WORDS = [];
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
      }, CONFIG.ROUND_INTERVAL * 60 * 1000)
    });
  });
}

function stopGame() {
  console.log("Stopping game...");
  GAME.IN_PROGRESS = false;
  gameCount++;
  clearInterval(roundLoop);

  fs.writeFile(__dirname + '/gamecount.txt', gameCount, function (err) {
    if (err) {
      console.log('Error!', err);
    }
  });
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

function sendCompiledTweet(replyToID) {
  let debugPrefix = CONFIG.DEBUG ? `DEBUGESSIE\ngameword: ${GAME.WORD.join("")}\nlastguessletter: ${GAME.GUESSED.LETTERS[GAME.GUESSED.LETTERS.length -  1]}\nlastguessword: ${GAME.GUESSED.WORDS[GAME.GUESSED.WORDS.length -  1]}\n\n` : ``;
  let previousGuesses = GAME.GUESSED.LETTERS.length > 0 ? `\n\nGeraden letters:\n${GAME.GUESSED.LETTERS.join(" ")}` : ``;
     previousGuesses += GAME.GUESSED.WORDS.length > 0 ? `\n\nGeraden woorden:\n${GAME.GUESSED.WORDS.join(" ")}` : ``;

  let params = { 
    status: `${debugPrefix}${PHASE[GAME.PHASE]}\n\n${GAME.OUT.join(" ")}${previousGuesses}\n\nSpel nr. ${gameCount}`
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
      if (!GAME.IN_PROGRESS) {
        console.log("Game is no longer in progress, aborting round.");
        return;
      }

      if (!tweets) {
        console.log("Found no tweets.");
        runWinLossChecks();
        return;
      }

      // Find majority symbol
      let letters = WordMan.getPopularSymbol(tweets, true), letterIndex = 0;
      let words = WordMan.getPopularSymbol(tweets);

      if (!letters && !words) {
        console.log("Tweets were found but none contained single characters or valid words.")
        return;
      }

      let guessStatusWord = CONFIG.GUESS_ENUM.INVALID;
      // Guess only the most popular word
      if (words[0] && words.length > 0) {
        guessStatusWord = WordMan.guessWord(words[0]);
        console.log("Processing guess for word " + words[0] + " and got status " + CONFIG.GUESS_ENUM[guessStatusWord])
      }

      if (guessStatusWord === CONFIG.GUESS_ENUM.RIGHT) {
        doAfterVictory(); 
        return;
      }

      let guessStatusLetter = WordMan.guessLetter(letters[letterIndex]);

      // Loop through every letter until we get one that's not been guessed yet
      while (guessStatusLetter === CONFIG.GUESS_ENUM.REPEAT) {
        letterIndex++;

        if (letterIndex >= letters.length) {
          console.log("No unrepeated letter found.");
          return;
        } 

        guessStatusLetter = WordMan.guessLetter(letters[letterIndex]);
      }

      // A word was guessed but it was wrong, so we increment the phase
      if (guessStatusWord === CONFIG.GUESS_ENUM.WRONG) {
        GAME.PHASE++;
      } else if (guessStatusLetter === CONFIG.GUESS_ENUM.WRONG) {
        // False letter was guessed
        GAME.PHASE++;
      }

      // Send the main tweet with the gallow, guessed words and all
      sendCompiledTweet(lastStatus);

      // Run the win/loss checks to see if the phase has incremented to the point that we lost, or if the last letter guessed completed the word and we won
      runWinLossChecks();
  });
}

function runWinLossChecks() {
  // Check if we lost
  console.log(`Checking for loss, game is in phase ${GAME.PHASE}, game will be terminated at phase ${PHASE.length}. This currently holds to be: ${GAME.PHASE >= PHASE.length}`)
  if (GAME.PHASE >= PHASE.length - 1) {
    setTimeout(function() {
      doAfterLoss();
    }, 1000)
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
    if (tweets.length === 0) {
      // Fallback if no tweets are found for whatever reason
      sendUncompiledTweet(`Gewonnen :D\n\nHet woord was: '${GAME.WORD.join("")}'\n\nDe volgende ronde start om ${nextGameTime}`, lastStatus);
      return;
    }

    tweets = tweets.filter(tweet => {
      // Only count tweets that added the last correct letter, or the entire word
      return (WordMan.cleanStatus(tweet.text).substr(0, 1) == GAME.GUESSED.LETTERS[GAME.GUESSED.LETTERS.length - 1] || WordMan.cleanStatus(tweet.text) == GAME.GUESSED.WORDS[GAME.GUESSED.WORDS.length - 1]) && tweet.user.screen_name != "galgjebot";
    });

    // Make sure every user is only counted once
    let users = [];
    tweets.forEach(tweet => {
      users.push(tweet.user.screen_name);
    });

    users = WordMan.removeDuplicatesFrom(users);

    let winningPlayers = "";
    users.forEach(user => {
      winningPlayers += "@";
      winningPlayers += user;
      winningPlayers += " ";
    })
    
    sendUncompiledTweet(`Gewonnen :D\n\nHet woord was: '${GAME.WORD.join("")}' en is geraden door ${winningPlayers}\n\nDe volgende ronde start om ${nextGameTime}`, lastStatus);

    lastDifficulty = lastDifficulty - 2;
    stopGame();
    return;
  })
}

function doAfterLoss() {
  console.log("Game lost")
  // Game over, set up new game
  sendUncompiledTweet(`Verloren :(\n\nHet woord was '${GAME.WORD.join("")}'\n\nDe volgende ronde start om ${nextGameTime}`, lastStatus);
  lastDifficulty = lastDifficulty + 2;
  stopGame();

  return;
}