import {faker} from '@faker-js/faker'

export const generateProducts=()=>{
    return{
        _id:faker.database.mongodbObjectId(),
        title:faker.commerce.productName(),
        price:faker.commerce.price(),
        stock:faker.number.int({min: 1, max: 100}),
        thumbnail:faker.image.urlLoremFlickr(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        code: faker.number.bigInt({ min: 10n, max: 10000n }),
        status: faker.datatype.boolean()
    }
}