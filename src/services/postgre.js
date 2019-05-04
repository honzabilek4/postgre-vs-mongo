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
    try {
      const duration = measure(async () => {await this.client.query("UPDATE projects SET data = jsonb_set(data::jsonb, '{price}'::text[], (COALESCE(data->>'price','0')::real + 1)::text::jsonb);")});
      return duration;
    } catch (e) {
      console.error(e);
    }
  }

  async update2(data) {
    try {
      const first_json = JSON.stringify(data[0]);
      const duration = measure( async () => {await this.client.query("UPDATE projects SET data = ($1)", [first_json])});
      return duration;
    } catch(e) {
      console.error(e);
    }
  }

  async test_count() {
    try {
      const duration = measure(async () => {await this.client.query("SELECT data->>'department', COUNT(*) FROM projects GROUP BY data->>'department';")});
      return duration;
    } catch(e) {
      console.error(e);
    }
  }

  async test_sum() {
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

  async test_select_like() {
    try{
      const duration = measure(async () => {await this.client.query("SELECT * FROM projects WHERE (data->>'email') LIKE 'La%';")});
      return duration;
    } catch (e) {
      console.error(e);
    }
  }

  async create_email_index() {
      try {
          await this.client.query("CREATE INDEX email_idx ON projects((data->>'email') text_pattern_ops);")
      } catch(e) {
          console.error(e);
      }
  }

  async drop_email_index() {
      try {
          await this.client.query("DROP INDEX email_idx;");
      } catch (e) {
          console.error(e);
      }
  }
  
  async del(key){
      try {
      const duration = measure(async () => {await this.client.query("DELETE FROM projects WHERE data->>'last_name' = '"+key+"';")});
      return duration;
    } catch(e) {
      console.error(e);
    }
  }
  
     async between(l,h){
      try {
      const duration = measure(async () => {await this.client.query("SELECT * FROM projects WHERE cast(data->>'number' as integer) BETWEEN "+l+" AND "+h+";")});
      return duration;
    } catch(e) {
      console.error(e);
    }
  }
  
  async create_last_name_index() {
      try {
          await this.client.query("CREATE INDEX ln_idx ON projects((data->>'last_name'));");
      } catch(e) {
          console.error(e);
      }
  }

  async drop_last_name_index() {
      try {
          await this.client.query("DROP INDEX ln_idx;");
      } catch (e) {
          console.error(e);
      }
  }
  
  
    async create_number_index() {
      try {
          await this.client.query("CREATE INDEX num_idx ON projects USING gin(data);");
      } catch(e) {
          console.error(e);
      }
  }

  async drop_number_index() {
      try {
          await this.client.query("DROP INDEX num_idx;");
      } catch (e) {
          console.error(e);
      }
  }
  
};