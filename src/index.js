"use strict";
const { Client } = require('pg');
const connectionString = 'postgresql://postgres:example@pg:5432/test';
const express = require('express');
const MongoService = require('./services/mongdb');

const app = express();

app.get('/', (req, res) => {
    res.send('postgres-vs-mongo example app');
})


// app.get('/pg', function (req, res) {
//     const client = new Client({
//         connectionString: connectionString
//     })
//     client.connect();

//     client.query('SELECT NOW()', (error, response) => {
//         res.send(response);
//     })
// });

app.get('/mongo', function (req, res) {
    const mongo = new MongoService();
    res.send(mongo.runCommand());
});

app.listen(3000);
