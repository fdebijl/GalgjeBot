import { MongoClient, Db } from 'mongodb';

let client: MongoClient;
let db: Db;

const connect = async (mongoUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve();
    }

    if (!mongoUrl) {
      throw new Error('Expected a SRV connection string but received undefined - please ensure MONGO_URL is set in the environment variables.');
    }

    client = new MongoClient(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      appname: 'Galgjebot'
    });

    client.connect((error) => {
      if (error) {
        reject(error);
        return;
      }

      db = client.db();

      resolve();
    });
  });
}

export {
  client,
  db,
  connect
}