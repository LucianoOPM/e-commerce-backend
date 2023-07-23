const { faker } = require('@faker-js/faker')

const productGenerator = () => {

    const stock = faker.number.int({ max: 20 })

    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 50, max: 100 }),
        thumbnails: [faker.image.url(), faker.image.url()],
        code: faker.string.nanoid({ min: 10, max: 15 }),
        stock,
        status: stock === 0,
        category: faker.commerce.department()
    }
}

const userGenerator = _ => {
    let user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 10 }),
        birthdate: faker.date.birthdate()
    }

    return user
}

module.exports = {
    productGenerator,
    userGenerator
}