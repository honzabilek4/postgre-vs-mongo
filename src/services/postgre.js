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
};