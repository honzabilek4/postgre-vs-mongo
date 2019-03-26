const { PgClient } = require('pg');
const connectionString = 'postgresql://postgres:example@pg:5432/test';
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const app = express();

app.get('/',(req,res)=>{
    res.send('postgres-vs-mongo example app');
})


app.get('/pg', function (req, res) {
    const client = new PgClient({
        connectionString: connectionString
    })
    client.connect();

    client.query('SELECT NOW()', (error, response) => {
        res.send(response);
    })
});

app.get('/mongo', function (req, res) {
    const url = 'mongodb://mongo:27017';
    const dbName = 'test';

    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        client.close();
        res.send("Connected successfully to server");
    });
});

app.listen(3000);
