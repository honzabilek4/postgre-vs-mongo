const MongoService = require('../services/mongdb');
const PostgreService = require('../services/postgre');
const FakerService = require('../services/faker');

module.exports = class TestSelectLike {
    async runTest(dataSize, iterations, withIndex) {
        try {
            const pg = new PostgreService();
            const mongo = new MongoService();
            const faker = new FakerService();

            let pg_result = [];
            let mongo_result = [];

            await pg.connect();
            await pg.initSchema();
            await mongo.connect();

            await pg.truncateSchema();
            const data = faker.getRandomJson(dataSize, 0);
            await pg.insertData(data);
            await mongo.removeDocuments();
            await mongo.insertData(data);

            if (withIndex) {
                await pg.create_department_index();
                await mongo.create_department_index();
            }

            for (let i = 1; i <= iterations; i++) {
                pg_result.push(await pg.test_select_like());
                mongo_result.push(await mongo.test_select_like());
            }
            if (withIndex) {
                await pg.drop_department_index();
                await mongo.drop_department_index();
            }

            return {
                pg: pg_result,
                mongo: mongo_result
            };
        } catch (e) {
            console.error(e);
        }
    }
};