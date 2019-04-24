"use strict";
const express = require('express');
const MongoService = require('./services/mongdb');
const PostgreService = require('./services/postgre');
const FakerService = require('./services/faker');

const app = express();

app.get('/', (req, res) => {
  res.send('postgres-vs-mongo example app');
});


app.get('/pg', async function (req, res) {
  const pg = new PostgreService();
  const result = await pg.runCommand();
  res.send(result);
});

app.get('/mongo', async function (req, res) {
  const mongo = new MongoService();
  await mongo.connect();
  const hrstart = process.hrtime()
  await mongo.runCommand();
  const hrend = process.hrtime(hrstart)
  console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
  await mongo.close();
  res.send("Success!");
});

app.get('/fake', async function (req, res) {
  const faker = new FakerService();
  res.send(faker.getUsers(1000000));
});

app.get('/updateJson', async function (req, res) {
  const faker = new FakerService();
  res.send(faker.getUpdateJson(100, 50));
});

app.get('/createData', async function (req, res) {
  const faker = new FakerService();
  const pg = new PostgreService();
  const result =  await pg.createData(faker);
  res.send(result);
});

app.get('/createMongoData', async function (req, res) {
  const faker = new FakerService();
  const mongo = new MongoService();
  await mongo.connect();
  const result = mongo.createData(faker);
  await mongo.close();
  res.send(result);
});

app.listen(3000);
