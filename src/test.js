"use strict";
const express = require('express');
const program = require('commander');
const MongoService = require('./services/mongdb');
const PostgreService = require('./services/postgre');
const FakerService = require('./services/faker');
const TestInsert = require('./tests/test-insert');
const TestSelect = require('./tests/test-select');
const TestUpdate = require('./tests/test-update');
const TestAggregation = require('./tests/test-aggregation');
const TestSelectLike = require('./tests/test-select-like');

const SMALL = 200;
const MEDIUM = 20000;
const LARGE = 200000;
const ITERATIONS = 10;
const UPDATE_NESTING = 50;

program
    .command('insert')
    .description('Test insert queries')
    .action(async () => {
        const test = new TestInsert();
        let result = {};
        console.log("Testing small data..");
        result["small"] = await test.runTest(SMALL, ITERATIONS);
        console.log("Testing medium data..");
        result["medium"] = await test.runTest(MEDIUM, ITERATIONS);
        console.log("Testing large data..");
        result["large"] = await test.runTest(LARGE, ITERATIONS);
        console.log(result);        
    });
program
    .command('select')
    .description('Test select queries')
    .action(async () => {        
        const test = new TestSelect();
        let result = {};
        console.log("Testing small data..");
        result["small"] = await test.runTest(SMALL, ITERATIONS);
        console.log("Testing medium data..");
        result["medium"] = await test.runTest(MEDIUM, ITERATIONS);
        console.log("Testing large data..");
        result["large"] = await test.runTest(LARGE, ITERATIONS);
        console.log(result);         
    });

program.parse(process.argv);


