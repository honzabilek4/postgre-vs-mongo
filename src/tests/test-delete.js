const MongoService = require('../services/mongdb');
const PostgreService = require('../services/postgre');
const FakerService = require('../services/faker');

module.exports = class TestDelete {
    async runTest(dataSize, iterations, index) {
        try {
            const pg = new PostgreService();
            const faker = new FakerService();
            const mongo = new MongoService();

            const data = faker.getRandomJson(dataSize, 0);

            await pg.connect();
            await pg.initSchema();
            
            let pg_result = [];

            await mongo.connect();
            let mongo_result = [];
     

            let key = data[0].last_name;

            for (let i = 1; i <= iterations; i++) {

                await pg.truncateSchema();
                await pg.insertData(data);
                
                await mongo.removeDocuments();
                await mongo.insertData(data); 
                
                if(index){
                    await pg.create_last_name_index();
                    await mongo.create_last_name_index();
                }
                
                pg_result.push(await pg.del(key));
                mongo_result.push(await mongo.del(key));

                if(index){
                await pg.drop_last_name_index();
                await mongo.drop_last_name_index();
                }
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

