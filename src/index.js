"use strict";
const express = require('express');
const MongoService = require('./services/mongdb');
const PostgreService = require('./services/postgre');
const FakerService = require('./services/faker');
const TestInsert = require('./tests/test-insert');

const app = express();

const SMALL = 200;
const MEDIUM = 20000;
const LARGE = 200000;

app.get('/', (req, res) => {
  res.send('postgres-vs-mongo example app');
});

app.get('/insert', async (req, res) => {
  const test = new TestInsert();
  let result = {};
  result["small"] = await test.runTest(SMALL, 10);
  result["medium"] = await test.runTest(MEDIUM, 10);
  result["large"] = await test.runTest(LARGE, 10);
  res.send(result);
});

app.get('/select', async (req, res) => {
  
});

app.get('/testUpdate1', async function (req, res) {
  //  partial update bez zanoreni
  const pg = new PostgreService();
  const faker = new FakerService();
  const mongo = new MongoService();
  await pg.connect();
  await pg.initSchema();
  let pg_result = [];
  await mongo.connect();
  let mongo_result = [];
  for (let i = 1; i <= 10; i++) {
    await pg.truncateSchema();
    const data = faker.getRandomJson(2000, 0);
    await pg.insertData(data);
    pg_result.push(await pg.update1());

    await mongo.removeDocuments();
    await mongo.insertData(data);
    mongo_result.push(await mongo.update1());
  }
  res.send({ pg: pg_result, mongo: mongo_result });
});

app.get('/testUpdate2', async function (req, res) {
  //  partial update so zanoreniami
  const pg = new PostgreService();
  const faker = new FakerService();
  const mongo = new MongoService();
  await pg.connect();
  await pg.initSchema();
  let pg_result = [];
  await mongo.connect();
  let mongo_result = [];
  for (let i = 1; i <= 10; i++) {
    await pg.truncateSchema();
    const data = faker.getRandomJson(2000, 50);
    await pg.insertData(data);
    pg_result.push(await pg.update1());

    await mongo.removeDocuments();
    await mongo.insertData(data);
    mongo_result.push(await mongo.update1());
  }
  res.send({ pg: pg_result, mongo: mongo_result });
});

app.get('/testUpdate3', async function (req, res) {
  //    full update bez zanoreni
  const pg = new PostgreService();
  const faker = new FakerService();
  const mongo = new MongoService();
  await pg.connect();
  await pg.initSchema();
  let pg_result = [];
  await mongo.connect();
  let mongo_result = [];
  for (let i = 1; i <= 10; i++) {
    await pg.truncateSchema();
    const data = faker.getRandomJson(2000, 0);
    await pg.insertData(data);
    pg_result.push(await pg.update3(data));

    await mongo.removeDocuments();
    await mongo.insertData(data);
    mongo_result.push(await mongo.update2(data));
  }
  res.send({ pg: pg_result, mongo: mongo_result });
});

app.get('/testUpdate4', async function (req, res) {
  //    full update so zanoreniami
  const pg = new PostgreService();
  const faker = new FakerService();
  const mongo = new MongoService();
  await pg.connect();
  await pg.initSchema();
  let pg_result = [];
  await mongo.connect();
  let mongo_result = [];
  for (let i = 1; i <= 10; i++) {
    await pg.truncateSchema();
    const data = faker.getRandomJson(2000, 50);
    await pg.insertData(data);
    pg_result.push(await pg.update3(data));

    await mongo.removeDocuments();
    await mongo.insertData(data);
    mongo_result.push(await mongo.update2(data));
  }
  res.send({ pg: pg_result, mongo: mongo_result });
});

app.get('/testAgg1', async function (req, res) {
  //    vsetky tri agregacie bez indexu
  const pg = new PostgreService();
  const faker = new FakerService();
  const mongo = new MongoService();
  await pg.connect();
  await pg.initSchema();
  await pg.truncateSchema();
  const data = faker.getRandomJson(2000, 0);
  await pg.insertData(data);
  let pg_result_count = [];
  let pg_result_sum = [];
  let pg_result_max = [];
  await mongo.connect();
  let mongo_result_count = [];
  let mongo_result_sum = [];
  let mongo_result_max = [];
  await mongo.removeDocuments();
  await mongo.insertData(data);
  for (let i = 1; i <= 10; i++) {
    pg_result_count.push(await pg.test_count());
    pg_result_sum.push(await pg.test_sum());
    pg_result_max.push(await pg.test_max());
    mongo_result_count.push(await mongo.test_count());
    mongo_result_sum.push(await mongo.test_sum());
    mongo_result_max.push(await mongo.test_max());
  }
  res.send({
    pg_count: pg_result_count,
    pg_sum: pg_result_sum,
    pg_max: pg_result_max,
    mongo_count: mongo_result_count,
    mongo_sum: mongo_result_sum,
    mongo_max: mongo_result_max
  });
});

app.get('/testAgg2', async function (req, res) {
  //    vsetky tri agregacie s indexom
  const pg = new PostgreService();
  const faker = new FakerService();
  const mongo = new MongoService();
  await pg.connect();
  await pg.initSchema();
  await pg.truncateSchema();
  const data = faker.getRandomJson(2000, 0);
  await pg.insertData(data);
  await pg.create_department_index();
  let result_count = [];
  let result_sum = [];
  let result_max = [];
  await mongo.connect();
  let mongo_result_count = [];
  let mongo_result_sum = [];
  let mongo_result_max = [];
  await mongo.removeDocuments();
  await mongo.insertData(data);
  await mongo.create_department_index();
  for (let i = 1; i <= 10; i++) {
    result_count.push(await pg.test_count());
    result_sum.push(await pg.test_sum());
    result_max.push(await pg.test_max());

    mongo_result_count.push(await mongo.test_count());
    mongo_result_sum.push(await mongo.test_sum());
    mongo_result_max.push(await mongo.test_max());
  }
  await pg.drop_department_index();
  await mongo.drop_department_index();
  res.send({
    count: result_count,
    sum: result_sum,
    max: result_max,
    mongo_count: mongo_result_count,
    mongo_sum: mongo_result_sum,
    mongo_max: mongo_result_max
  });
});

app.get('/testDel1', async function (req, res) {
  //delete bez indexu
  const loop = 10;

  const pg = new PostgreService();
  const mongo = new MongoService();
  const faker = new FakerService();

  let pg_result = [];
  let mongo_result = [];

  let pg_sum = 0;
  let mongo_sum = 0;

  const data = faker.getRandomJson(20000, 0);
  const data2 = JSON.parse(JSON.stringify(data));

  let key = data[0].last_name;

  await pg.connect();
  await pg.initSchema();

  await mongo.connect();
  await mongo.removeDocuments();

  for (let i = 1; i <= loop; i++) {
    await pg.truncateSchema();
    await pg.insertData(data);
    await pg.insertData(data2);

    pg_result.push(await pg.del(key));

    await mongo.removeDocuments();
    await mongo.insertData(data);
    await mongo.insertData(data2);

    mongo_result.push(await mongo.del(key));
  }

  res.send({
    pg: pg_result,
    mongo: mongo_result,
  });
});

app.get('/testDel2', async function (req, res) {
  //delete s indexy
  const loop = 10;

  const pg = new PostgreService();
  const mongo = new MongoService();
  const faker = new FakerService();

  let pg_result = [];
  let mongo_result = [];

  let pg_sum = 0;
  let mongo_sum = 0;

  const data = faker.getRandomJson(20000, 0);
  const data2 = JSON.parse(JSON.stringify(data));

  let key = data[0].last_name;

  await pg.connect();
  await pg.initSchema();

  await mongo.connect();
  await mongo.removeDocuments();

  for (let i = 1; i <= loop; i++) {
    await pg.truncateSchema();
    await pg.create_last_name_index();
    await pg.insertData(data);
    await pg.insertData(data2);

    let a = await pg.del(key);
    pg_sum += a;
    pg_result.push(a);

    await pg.drop_last_name_index();

    await mongo.removeDocuments();
    await mongo.create_last_name_index();
    await mongo.insertData(data);
    await mongo.insertData(data2);

    let b = await mongo.del(key);
    mongo_sum += b;
    mongo_result.push(b);

    await mongo.drop_last_name_index();
  }

  res.send({
    pg: pg_result,
    mongo: mongo_result
  });
});

app.get('/testRange2', async function (req, res) {
  //between s indexy
  const loop = 10;

  const pg = new PostgreService();
  const mongo = new MongoService();
  const faker = new FakerService();

  let pg_result = [];
  let mongo_result = [];

  let pg_sum = 0;
  let mongo_sum = 0;

  let l = 10;
  let h = 10000;

  const data = faker.getRandomJson(20000, 0);

  let key = data[0].last_name;

  await pg.connect();
  await pg.initSchema();

  await mongo.connect();
  await mongo.removeDocuments();

  for (let i = 1; i <= loop; i++) {
    await pg.truncateSchema();
    await pg.create_number_index();
    await pg.insertData(data);

    let a = await pg.between(l, h);
    pg_sum += a;
    pg_result.push(a);

    await pg.drop_number_index();

    await mongo.removeDocuments();
    await mongo.create_number_index();
    await mongo.insertData(data);

    let b = await mongo.between(l, h);
    mongo_sum += b;
    mongo_result.push(b);

    await mongo.drop_number_index();
  }


  res.send({
    pg: pg_result,
    mongo: mongo_result
  });
});

app.get('/testRange1', async function (req, res) {
  //between bez indexu
  const loop = 10;

  const pg = new PostgreService();
  const mongo = new MongoService();
  const faker = new FakerService();

  let pg_result = [];
  let mongo_result = [];

  let pg_sum = 0;
  let mongo_sum = 0;

  let l = 10;
  let h = 10000;

  const data = faker.getRandomJson(20000, 0);

  let key = data[0].last_name;

  await pg.connect();
  await pg.initSchema();

  await mongo.connect();
  await mongo.removeDocuments();

  for (let i = 1; i <= loop; i++) {
    await pg.truncateSchema();

    await pg.insertData(data);

    let a = await pg.between(l, h);
    pg_sum += a;
    pg_result.push(a);


    await mongo.removeDocuments();

    await mongo.insertData(data);

    let b = await mongo.between(l, h);
    mongo_sum += b;
    mongo_result.push(b);


  }


  res.send({
    pg: pg_result,
    mongo: mongo_result

  });
});

app.get('/testSelectLike1', async function (req, res) {
  //    select-like bez indexu
  const pg = new PostgreService();
  const mongo = new MongoService();
  const faker = new FakerService();

  let pg_result = [];
  let mongo_result = [];

  await pg.connect();
  await pg.initSchema();
  await mongo.connect();

  await pg.truncateSchema();
  const data = faker.getRandomJson(2000, 0);
  await pg.insertData(data);
  await mongo.removeDocuments();
  await mongo.insertData(data);

  for (let i = 1; i <= 10; i++) {
    pg_result.push(await pg.test_select_like());
    mongo_result.push(await mongo.test_select_like());
  }

  res.send({
    pg: pg_result,
    mongo: mongo_result
  });
});

app.get('/testSelectLike2', async function (req, res) {
  //    select s indexom
  const pg = new PostgreService();
  const mongo = new MongoService();
  const faker = new FakerService();

  let pg_result = [];
  let mongo_result = [];

  await pg.connect();
  await pg.initSchema();
  await mongo.connect();

  await pg.truncateSchema();
  const data = faker.getRandomJson(2000, 0);
  await pg.insertData(data);
  await mongo.removeDocuments();
  await mongo.insertData(data);
  await pg.create_department_index();
  await mongo.create_department_index();

  for (let i = 1; i <= 10; i++) {
    pg_result.push(await pg.test_select_like());
    mongo_result.push(await mongo.test_select_like());
  }

  await pg.drop_department_index();
  await mongo.drop_department_index();

  res.send({
    pg: pg_result,
    mongo: mongo_result
  });
});

app.get('/clearPg', async function (req, res) {
  const pg = new PostgreService();
  await pg.connect();
  const result = await pg.dropSchema();
  res.send(result);
});

app.get('/clearMongo', async function (req, res) {
  const mongo = new MongoService();
  await mongo.connect();
  const result = await mongo.removeDocuments();
  res.send(result);
});

app.listen(3000);
