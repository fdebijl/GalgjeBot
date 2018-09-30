module.exports = {
	apps: [
    {
    	name: 'Hangman API',
    	script: 'server.js',
			watch: ["hm_server.js", "hm_config.js", "hm_game.js", "hm_wordman.js", "package.json"]
    }
  ]
};
