const Faker = require('faker');

module.exports = class FakerService {

    constructor() { }

    getUsers(amount) {
        return [...Array(amount)].map(() => {
            return Faker.name.findName();
        });
    }

    getUpdateJson(amount, nesting) {
        let data = [];
        for (let id=1; id <= amount; id++) {

            let firstName = Faker.name.firstName();
            let lastName = Faker.name.lastName();
            let email = Faker.internet.email();
            let nestedTrash = {'users': this.getUsers(amount)};

            for (let id=1; id <= nesting; id++) {
                nestedTrash = {'trash': nestedTrash};
            }

            data.push({
                "id": id,
                "first_name": firstName,
                "last_name": lastName,
                "email": email,
                'trash': nestedTrash
            });
        }
        return data;
    }

};