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

  async removeDocuments() {
      try {
          await this.db.collection('projects').remove({});
      } catch (e) {
          console.error(e);
      }
  }

  async update1() {
      try {
          return measure(async () => {
              await this.db.collection('projects').updateMany({}, {$inc: {price: 1}});
          });
      } catch (e) {
          console.error(e);
      }
  }

  async update2(data) {
      try {
          return measure(async () => {
              let bulk = await this.db.collection('projects').initializeUnorderedBulkOp();
              await bulk.find({}).update(
                  {$set:{
                      first_name: data[0]['first_name'],
                      last_name: data[0]['last_name'],
                      email: data[0]['email'],
                      department: data[0]['department'],
                      product: data[0]['product'],
                      price: data[0]['price'],
                      trash: data[0]['trash']
                      }});
              await bulk.execute();
          });
      } catch(e) {
          console.error(e);
      }
  }

  async test_count() {
      try {
          return measure(async () => {
              await this.db.collection('projects').aggregate([
                  {"$group":
              {
                  "_id"
              :
                  "$department",
                      "count"
              :
                  {
                      "$sum"
                  :
                      1
                  }
              }}]);
          });
      } catch (e) {
          console.error(e);
      }
  }

  async test_sum() {
    try {
        return measure(async () => {
            await this.db.collection('projects').aggregate([
                {"$group": {"_id": "$department", "total": {"$sum": "$price"}}}]);

        })
    } catch (e) {
        console.error(e);
    }
  }

  async test_max() {
    try {
        return measure(async () => {
            await this.db.collection('projects').aggregate([
                {$group: {_id: "$department", max_value: {$max: "$price"}}}]);

        })
    } catch (e) {
        console.error(e);
    }
  }

  async create_department_index() {
      try {
          await this.db.collection('projects').createIndex({department: 1}, {name: "dep_idx"});
      } catch (e) {
          console.error(e);
      }
  }

  async drop_department_index() {
      try {
          await this.db.collection('projects').dropIndex("dep_idx");
      } catch (e) {
          console.error(e);
      }
  }
};
