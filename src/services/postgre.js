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
      const data = JSON.stringify(faker.getUpdateJson(2, 0));
      await this.client.query('INSERT INTO project (data) VALUES (json_array_elements($1))', [data]);
      const hrstart = process.hrtime();
      const result = await this.client.query('SELECT * FROM project');
      const hrend = process.hrtime(hrstart);
      console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
      return result.rows;
    } catch (e) {
      console.error(e);
    }
  }
};