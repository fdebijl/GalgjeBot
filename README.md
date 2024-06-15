# [GalgjeBot](https://twitter.com/galgjebot)
 
> [!IMPORTANT] 
> This project is discontinued due to the changes made under Twitter's (currently branded as 'X') new API policies, which are deterimental to hobby projects such as this one. The new direction Twitter is taking is very disappointing to developers such as myself and prevent a new generation of developers from using Twitter's power to explore development and learn new skills.
 
[![codecov](https://codecov.io/gh/Fdebijl/GalgjeBot/branch/master/graph/badge.svg?token=UOCX75BZY2)](https://codecov.io/gh/Fdebijl/GalgjeBot)

Play hangman on Twitter

### Building
Ensure the dotenvtemplate is filled out and saved as `.env`.

```sh
npm install
node dist
```

Or run as a Docker container:
```
docker image build -t fdebijl/galgjebot .
docker container run --detach --name galgjebot fdebijl/galgjebot
```

You will need a set of API keys from Twitter in order to actually send out the hangman Tweets. You can get these from the [Twitter Developer](https://developer.twitter.com/en/apply-for-access) site. These keys are picked up from the following environment variables:
```
CONSUMER_KEY
CONSUMER_SECRET
ACCESS_TOKEN
ACCESS_TOKEN_SECRET
```
dotenv is included as a devDependency, it is recommended to use a `.env` file for local testing. See `/src/config.ts` for other relevant environment variables, such as the MongoDB connection string.
