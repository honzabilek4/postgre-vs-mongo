const Faker = require('faker');

module.exports = class FakerService {

    constructor() { }

    getUsers(amount) {
        return [...Array(amount)].map(() => {
            return Faker.name.findName();
        });
    }

    getRandomJson(amount, nesting) {
        let data = [];
        for (let id = 1; id <= amount; id++) {

            let firstName = Faker.name.firstName();
            let lastName = Faker.name.lastName();
            let email = Faker.internet.email();
            let department = Faker.commerce.department();
            let product = Faker.commerce.product();
            let price = Number(Faker.commerce.price());
            let number = Number(Faker.random.number());
            let nestedTrash =  Faker.lorem.words();

            for (let i = 1; i <= nesting; i++) {
                nestedTrash = { 'trash': nestedTrash };
            }

            data.push({
                "first_name": firstName,
                "last_name": lastName,
                "email": email,
                "department": department,
                "product": product,
                "price": price,
                "number":number,
                'trash': nestedTrash
            });
        }
        return data;
    }

};