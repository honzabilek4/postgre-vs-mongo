const MongoService = require('../services/mongdb');
const PostgreService = require('../services/postgre');
const FakerService = require('../services/faker');

module.exports = class TestUpdate {
    async runTest(dataSize, nesting, iterations, partialUpdate) {
        try {
            const pg = new PostgreService();
            const mongo = new MongoService();
            const faker = new FakerService();

            await pg.connect();
            await pg.initSchema();
            await mongo.connect();

            let pg_result = [];
            let mongo_result = [];

            for (let i = 1; i <= iterations; i++) {
                await pg.truncateSchema();
                const data = faker.getRandomJson(dataSize, nesting);
                await pg.insertData(data);
                if (partialUpdate) {
                    pg_result.push(await pg.update1());
                } else {
                    pg_result.push(await pg.update2(data));
                }

                await mongo.removeDocuments();
                await mongo.insertData(data);
                if (partialUpdate) {
                    mongo_result.push(await mongo.update1());
                } else {
                    mongo_result.push(await mongo.update2(data));
                }
            }
            return { pg: pg_result, mongo: mongo_result };
        } catch (e) {
            console.error(e);
        }
    }
};