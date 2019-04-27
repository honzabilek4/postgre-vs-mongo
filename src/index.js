"use strict";
const express = require('express');
const MongoService = require('./services/mongdb');
const PostgreService = require('./services/postgre');
const FakerService = require('./services/faker');

const app = express();

app.get('/', (req, res) => {
  res.send('postgres-vs-mongo example app');
});


app.get('/test', async function (req, res) {
  const pg = new PostgreService();
  const faker = new FakerService();
  await pg.connect();
  await pg.initSchema();
  await pg.truncateSchema();
  const data = faker.getRandomJson(20000, 0);
  let result = [];
  result.push(await pg.insertData(data));
  result.push(await pg.insertData(data));
  result.push(await pg.insertData(data));
  result.push(await pg.insertData(data));
  result.push(await pg.insertData(data));
  result.push(await pg.insertData(data));
  res.send(result);
});

app.get('/test2', async function (req, res) {
  const pg = new PostgreService();
  const faker = new FakerService();
  await pg.connect();  
  let result = [];
  result.push(await pg.selectAllData());  
  result.push(await pg.selectAllData());  
  res.send(result);
});


app.get('/test3', async function(req,res){
  const mongo = new MongoService();
  const faker = new FakerService();
  await mongo.connect();
  let data = faker.getRandomJson(2000, 0);
  let result = [];
  result.push(await mongo.insertData(data));
  data = faker.getRandomJson(2000, 0);
  result.push(await mongo.insertData(data));
  data = faker.getRandomJson(2000, 0);
  result.push(await mongo.insertData(data));
  data = faker.getRandomJson(2000, 0);
  result.push(await mongo.insertData(data));
  res.send(result);
});

app.get('/clear', async function (req, res) {
  const pg = new PostgreService();
  await pg.connect();
  const result = await pg.dropSchema();
  res.send(result);
});

app.get('/testUpdate1', async function(req, res){
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
  res.send({pg: pg_result, mongo: mongo_result});
});

app.get('/testUpdate2', async function(req, res){
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
    res.send({pg: pg_result, mongo: mongo_result});
});

app.get('/testUpdate3', async function(req, res) {
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
    res.send({pg: pg_result, mongo: mongo_result});
});

app.get('/testUpdate4', async function(req, res) {
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
    res.send({pg: pg_result, mongo: mongo_result});
});

app.get('/testAgg1', async function(req, res) {
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

app.get('/testAgg2', async function(req, res) {
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

app.listen(3000);
