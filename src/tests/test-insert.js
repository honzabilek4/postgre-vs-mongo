const MongoService = require('../services/mongdb');
const PostgreService = require('../services/postgre');
const FakerService = require('../services/faker');

module.exports = class TestInsert {
    async runTest (dataSize, iterations) {
        try {
            const pg = new PostgreService();
            const mongo = new MongoService();
            const faker = new FakerService();
            
            await pg.connect();
            await pg.initSchema();
            await mongo.connect();
            
            const data = faker.getRandomJson(dataSize, 0);
            
            let resultPg = [];
            for (let i = 0; i < iterations; i++) {
                await pg.truncateSchema();
                resultPg.push(await pg.insertData(data));
            }
            let resultMongo = [];
            for (let i = 0; i < iterations; i++) {
                await mongo.removeDocuments();
                resultMongo.push(await mongo.insertData(data));
            }
            return { pg: resultPg, mongo: resultMongo };
        }
        catch (e) {
            console.error(e);
        }
    }
}