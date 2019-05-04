"use strict";
const express = require('express');
const MongoService = require('./services/mongdb');
const PostgreService = require('./services/postgre');
const FakerService = require('./services/faker');
const TestInsert = require('./tests/test-insert');
const TestUpdate = require('./tests/test-update');
const TestAggregation = require('./tests/test-aggregation');
const TestSelectLike = require('./tests/test-select-like');

const app = express();

const SMALL = 200;
const MEDIUM = 20000;
const LARGE = 200000;
const ITERATIONS = 10;
const UPDATE_NESTING = 50;

app.get('/testAgg', async function (req, res) {
  //    test COUNT, SUM and MAX
  const test = new TestAggregation();
  let result = [];
  result["small"] = await test.runTest(SMALL, ITERATIONS, false);
  result["medium"] = await test.runTest(MEDIUM, ITERATIONS, false);
  result["large"] = await test.runTest(LARGE, ITERATIONS, false);
  res.send(result);
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

app.listen(3000);
