const MongoService = require('../services/mongdb');
const PostgreService = require('../services/postgre');
const FakerService = require('../services/faker');

module.exports = class TestSelect {
    async runTest (dataSize, iterations) {
        try {
            const pg = new PostgreService();
            const mongo = new MongoService();
            const faker = new FakerService();

            await pg.connect();
            await pg.initSchema();
            await mongo.connect();

            await pg.truncateSchema();

            const data = faker.getRandomJson(dataSize, 0);
            await pg.insertData(data);

            let resultPg = [];
            for (let i = 0; i < iterations; i++) {
                resultPg.push(await pg.selectAllData());
            }

            await mongo.removeDocuments();
            await mongo.insertData(data);

            let resultMongo = [];
            for (let i = 0; i < iterations; i++) {
                resultMongo.push(await mongo.selectAllData());
            }
            return { pg: resultPg, mongo: resultMongo };
        }
        catch (e) {
            console.error(e);
        }
    }
}
   