const MongoService = require('../services/mongdb');
const PostgreService = require('../services/postgre');
const FakerService = require('../services/faker');

module.exports = class TestRange {
    async runTest(dataSize, iterations, index) {
        try {
            const pg = new PostgreService();
            const faker = new FakerService();
            const mongo = new MongoService();

            const data = faker.getRandomJson(dataSize, 0);

            await pg.connect();
            await pg.initSchema();
            await pg.truncateSchema();
       
            let pg_result = [];

            await mongo.connect();
            await mongo.removeDocuments();
            let mongo_result = [];
         

            let a = Math.floor((data[0].number + data[dataSize/2].number + data[--dataSize].number)/ 3);
            
        
            let l = 500;
            let h = a + 500;
            if(a - 500 > 0){
                l = a-500;
            }
           
            for (let i = 1; i <= iterations; i++) {
                await pg.truncateSchema();
                await pg.insertData(data);
                
                await mongo.removeDocuments();
                await mongo.insertData(data); 
                
                if(index){
                    await pg.create_number_index();
                    await mongo.create_number_index();
                }
                
                pg_result.push(await pg.between(l,h));
                mongo_result.push(await mongo.between(l,h));
                
                if(index){
                    await pg.drop_number_index();
                    await mongo.drop_number_index();
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