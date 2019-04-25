const { Client } = require('pg');
const { measure } = require('./../utils');

module.exports = class PostgreService {
  constructor() {
    this.CONNECTION_STRING = 'postgresql://postgres:example@pg:5432/test';
    this.client = new Client({
      connectionString: this.CONNECTION_STRING,
    })
  }

  async connect() {
    try {
      await this.client.connect();
    } catch (e) {
      console.error(e);
    }
  }  

  async initSchema() {
    try {
      await this.client.query('CREATE TABLE IF NOT EXISTS projects (ID serial NOT NULL PRIMARY KEY, data jsonb NOT NULL);');
    } catch (e) {
      console.error(e);
    }
  }

  async truncateSchema() {
    try {
      await this.client.query('TRUNCATE TABLE projects;');
    } catch (e) {
      console.error(e);
    }
  }

  async dropSchema() {
    try {
      return await this.client.query('DROP TABLE projects;');
    }
    catch (e) {
      console.error(e);
    }
  }

  async selectAllData() {
    try {
      const duration = measure(async () => { await this.client.query('SELECT count(*) FROM projects;') });
      return duration;
    } catch (e) {
      console.error(e);
    }
  }

  async insertData(data) {
    try {
      const serializedData = JSON.stringify(data);
      const duration = measure(async () => { await this.client.query('INSERT INTO projects (data) VALUES (json_array_elements($1))', [serializedData]) });
      return duration;
    } catch (e) {
      console.error(e);
    }
  }

};