const { Client } = require('pg');
const { measure } = require('./../utils');

module.exports = class PostgreService {
  constructor() {
    this.CONNECTION_STRING = 'postgresql://postgres:example@pg:5432/test';

    this.client = new Client({
      connectionString: this.CONNECTION_STRING,
    })
    this.client.connect();
  }

  async runCommand() {
    const result = await this.client.query('SELECT NOW() as now');
    return result.rows;
  }

  async createData(faker) {
    // this.client.query('CREATE TABLE project (ID serial NOT NULL PRIMARY KEY, data jsonb NOT NULL);');
    try {
      const data = JSON.stringify(faker.getUpdateJson(100, 20));
      measure(async () => { await this.client.query('INSERT INTO project (data) VALUES (json_array_elements($1))', [data]) });      
      const result = await this.client.query('SELECT * FROM project');
      return result.rows;
    } catch (e) {
      console.error(e);
    }
  }

  async updateTest1() {
  //  FULL UPDATE WITHOUT many nestings and without added indexes
  }

  async updateTest2() {
  //  FULL UPDATE WITHOUT many nestings and with added indexes
  }
};