const { Client } = require('pg');

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
    // this.client.query('CREATE TABLE project (ID serial NOT NULL PRIMARY KEY, data json NOT NULL);');
    try {
      const data = faker.getUpdateJson(2, 2);
      await this.client.query('INSERT INTO project (data) VALUES ($1)', [JSON.stringify(data)]);
      const result = await this.client.query('SELECT * FROM project');
      return result.rows;
    } catch (e) {
      console.error(e);
    }
  }
};