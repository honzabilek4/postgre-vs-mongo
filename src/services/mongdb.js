const MongoClient = require('mongodb').MongoClient;

module.exports = class MongoService {
    
    constructor() {
        this.CONNECTION_STRING = 'mongodb://mongo:27017';
        this.DB_NAME = 'test';
        this.db = null;

        MongoClient.connect(this.CONNECTION_STRING, function (err, client) {
            assert.equal(null, err);
            this.db = client.db(this.DB_NAME);
            console.log(db);
        });
    }

    runCommand() {
        return "Run test command.";
    }
};