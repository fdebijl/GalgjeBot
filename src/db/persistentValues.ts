import { CONFIG } from '../config';
import { db, connect } from './connect';

class PersistentValues {
  constructor() {
    (async () => {
      if (!db) {
        await connect(CONFIG.MONGO_URL);
      }

      await db.collection('persistentValues').findOne({key: 'lastDifficulty'}).then((keyValue) => {
        if (!keyValue) {
          db.collection('persistentValues').insertOne({key: 'lastDifficulty', value: 6});
        }
      })

      await db.collection('persistentValues').findOne({key: 'lastStatus'}).then((keyValue) => {
        if (!keyValue) {
          db.collection('persistentValues').insertOne({key: 'lastStatus', value: ''});
        }
      })

      await db.collection('persistentValues').findOne({key: 'secondToLastStatus'}).then((keyValue) => {
        if (!keyValue) {
          db.collection('persistentValues').insertOne({key: 'secondToLastStatus', value: ''});
        }
      })

      await db.collection('persistentValues').findOne({key: 'nextGameTime'}).then((keyValue) => {
        if (!keyValue) {
          db.collection('persistentValues').insertOne({key: 'nextGameTime', value: ''});
        }
      })
    })();
  }

  public getLastDifficulty(): Promise<number> {
    return new Promise((resolve) => {
      db.collection('persistentValues').findOne({key: 'lastDifficulty'}).then((keyValue) => {
        if (!keyValue) {
          resolve(6);
        }

        resolve(keyValue.value);
      })
    });
  }

  public setLastDifficulty(difficulty: number): Promise<unknown> {
    return db.collection('persistentValues').updateOne({key: 'lastDifficulty'}, {$set: {'value': difficulty}});
  }

  public getlastStatus(): Promise<string> {
    return new Promise((resolve) => {
      db.collection('persistentValues').findOne({key: 'lastStatus'}).then((keyValue) => {
        resolve(keyValue.value);
      })
    });
  }

  public setlastStatus(lastStatus: string): Promise<unknown> {
    return db.collection('persistentValues').updateOne({key: 'lastStatus'}, {$set: {'value': lastStatus}});
  }

  public getsecondToLastStatus(): Promise<string> {
    return new Promise((resolve) => {
      db.collection('persistentValues').findOne({key: 'secondToLastStatus'}).then((keyValue) => {
        resolve(keyValue.value);
      })
    });
  }

  public setsecondToLastStatus(secondToLastStatus: string): Promise<unknown> {
    return db.collection('persistentValues').updateOne({key: 'secondToLastStatus'}, {$set: {'value': secondToLastStatus}});
  }

  public getnextGameTime(): Promise<string> {
    return new Promise((resolve) => {
      db.collection('persistentValues').findOne({key: 'nextGameTime'}).then((keyValue) => {
        resolve(keyValue.value);
      })
    });
  }

  public setnextGameTime(nextGameTime: string): Promise<unknown> {
    return db.collection('persistentValues').updateOne({key: 'nextGameTime'}, {$set: {'value': nextGameTime}});
  }
}

export const PersistentValueStore = new PersistentValues();