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

app.get('/json', async (req,res)=>{
    const faker = new FakerService();
    res.send(faker.getRandomJson(1,1));
});

app.listen(3000);
