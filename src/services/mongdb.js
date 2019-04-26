const MongoClient = require('mongodb').MongoClient;
const { measure } = require('./../utils');

module.exports = class MongoService {

  constructor() {
    this.CONNECTION_STRING = 'mongodb://root:example@mongo:27017';
    this.DB_NAME = 'test';
    this.db = null;
    this.client = new MongoClient(this.CONNECTION_STRING);
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(this.DB_NAME, { recordQueryStats: true });
      console.log("Connected to the server");
    } catch (e) {
      console.error(e);
    }
  }

  async close() {
    await this.client.close();
  }

  async insertData(data) {
    try {
      return measure(async () => {
        await this.db.collection('projects').insertMany(data);
      });
    } catch (e) {
      console.error(e);
    }
  }
}
