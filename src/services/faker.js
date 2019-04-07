const Faker = require('faker');

module.exports = class FakerService {

    constructor() { }

    getUsers(amount) {
        return [...Array(amount)].map(() => {
            return Faker.name.findName();
        });
    }

};