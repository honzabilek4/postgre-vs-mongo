const MongoClient = require('mongodb').MongoClient;

module.exports = class MongoService {

  constructor() {
    this.CONNECTION_STRING = 'mongodb://mongo:27017';
    this.DB_NAME = 'test';
    this.db = null;
    this.client = new MongoClient(this.CONNECTION_STRING);
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Connected to the server");
    } catch (e) {
      console.log(err.stack);
    }
  }

  close() {
    this.client.close();
  }

  runCommand() {

    return "Running command.";
  }
}; 