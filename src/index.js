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
  const data = faker.getRandomJson(200, 1);  
  let result = [];    
  result.push(await pg.insertData(data));    
  result.push(await pg.insertData(data));  
  result.push(await pg.insertData(data));  
  result.push(await pg.insertData(data));  
  result.push(await pg.insertData(data));  
  res.send(result);
});

app.get('/clear', async function (req, res) {
  const pg = new PostgreService();  
  await pg.connect();
  const result = await pg.dropSchema();  
  res.send(result);
});

app.listen(3000);
