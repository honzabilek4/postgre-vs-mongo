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
      // TODO table sa bude volat projects alebo project
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
      const duration = measure(async () => { await this.client.query('SELECT * FROM projects;') });
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

  async update1() {
    // partial update bez zanoreni a so zanorenim - iba ine data, rovnaky dotaz
    try {
      const duration = measure(async () => {await this.client.query("UPDATE projects SET data = jsonb_set(data::jsonb, '{price}'::text[], (COALESCE(data->>'price','0')::real + 1)::text::jsonb);")});
      return duration;
    } catch (e) {
      console.error(e);
    }
  }

  async update3(data) {
  //  full update bez zanoreni a so zanorenim - iba ine data rovnaky dotaz
    try {
      const serializedData = JSON.stringify(data);
      const first_json = JSON.stringify(data[0]);
      // const duration = measure( async () => {await this.client.query("UPDATE project SET data = (json_array_elements($1))", [serializedData])});
      const duration = measure( async () => {await this.client.query("UPDATE projects SET data = ($1)", [first_json])});
      return duration;
    } catch(e) {
      console.error(e);
    }
  }

  async test_count() {
    // test for using count function s indexom a bez indexu na GROUP BY a atribute - ten isty dotaz iba sa medzi tym vytvori index
    try {
      const duration = measure(async () => {await this.client.query("SELECT data->>'department', COUNT(*) FROM projects GROUP BY data->>'department';")});
      return duration;
    } catch(e) {
      console.error(e);
    }
  }

  async test_sum() {
    // test for using sum function s indexom a bez indexu na GROUP BY atribute - ten isty dotaz
    try {
      const duration = measure(async () => {await this.client.query("SELECT data->>'department', SUM((data->>'price')::real) FROM projects GROUP BY data->>'department';")});
      return duration;
    } catch(e) {
      console.error(e);
    }
  }

  async test_max() {
    try {
      const duration = measure(async () => {await this.client.query("SELECT data->>'department', MAX((data->>'price')::real) FROM projects GROUP BY data->>'department';")});
      return duration;
    } catch(e) {
      console.error(e);
    }
  }

  async create_department_index() {
      try {
          await this.client.query("CREATE INDEX dep_idx ON projects((data->>'department'));");
      } catch(e) {
          console.error(e);
      }
  }

  async drop_department_index() {
      try {
          await this.client.query("DROP INDEX dep_idx;");
      } catch (e) {
          console.error(e);
      }
  }
};