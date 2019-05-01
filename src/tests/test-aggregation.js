const MongoService = require('../services/mongdb');
const PostgreService = require('../services/postgre');
const FakerService = require('../services/faker');

module.exports = class TestAggregation {
    async runTest(dataSize, iterations, withIndex) {
        try {
            const pg = new PostgreService();
            const faker = new FakerService();
            const mongo = new MongoService();

            await pg.connect();
            await pg.initSchema();
            await pg.truncateSchema();
            const data = faker.getRandomJson(dataSize, 0);
            await pg.insertData(data);
            let pg_result_count = [];
            let pg_result_sum = [];
            let pg_result_max = [];

            await mongo.connect();
            let mongo_result_count = [];
            let mongo_result_sum = [];
            let mongo_result_max = [];
            await mongo.removeDocuments();
            await mongo.insertData(data);

            if (withIndex) {
                await pg.create_department_index();
                await mongo.create_department_index();
            }

            for (let i = 1; i <= iterations; i++) {
                pg_result_count.push(await pg.test_count());
                pg_result_sum.push(await pg.test_sum());
                pg_result_max.push(await pg.test_max());
                mongo_result_count.push(await mongo.test_count());
                mongo_result_sum.push(await mongo.test_sum());
                mongo_result_max.push(await mongo.test_max());
            }

            if (withIndex) {
                await pg.drop_department_index();
                await mongo.drop_department_index();
            }

            return {
                pg_count: pg_result_count,
                pg_sum: pg_result_sum,
                pg_max: pg_result_max,
                mongo_count: mongo_result_count,
                mongo_sum: mongo_result_sum,
                mongo_max: mongo_result_max
            };
        } catch (e) {
            console.error(e);
        }
    }
};