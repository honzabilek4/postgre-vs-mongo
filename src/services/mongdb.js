const MongoClient = require('mongodb').MongoClient;

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
      this.db = this.client.db(this.DB_NAME);
      console.log("Connected to the server");
    } catch (e) {
      console.error(e);
    }
  }

  async close() {
    this.client.close();
  }

  async runCommand() {
    const r = await this.db.collection('test').insertOne({ a: 1 });
    console.log(r);
    return "Running command.";
  }
}; 