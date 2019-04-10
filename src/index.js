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

app.get('/mongo', function (req, res) {
  const mongo = new MongoService();
  res.send(mongo.runCommand());
});

app.get('/fake', function (req, res){
  const faker = new FakerService();
  res.send(faker.getUsers(1000000));
});

app.get('/updateJson', function (req, res) {
  const faker = new FakerService();
  res.send(faker.getUpdateJson(100, 50));
});

app.get('/createData', function (req, res) {
  const faker = new FakerService();
  const pg = new PostgreService();
  res.send(pg.createData(faker));
});

app.listen(3000);
