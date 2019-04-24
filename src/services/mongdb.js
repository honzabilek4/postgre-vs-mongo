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
      this.db = this.client.db(this.DB_NAME,{recordQueryStats:true});
      console.log("Connected to the server");
    } catch (e) {
      console.error(e);
    }
  }

  async close() {
    this.client.close();
  }

  async runCommand() {
    try{
      const hrstart = process.hrtime();
      const r = await this.db.collection('test').insertOne({ a: 1 });
      // const r = await this.db.collection('test').find({a:{$eq: 1}});      
      const hrend = process.hrtime(hrstart);
      console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
    }
    catch(e){
      console.log(e);
    }
    return "Running command.";
  }
}; 