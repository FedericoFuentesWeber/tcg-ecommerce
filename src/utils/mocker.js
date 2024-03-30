import { faker } from '@faker-js/faker';

export const generateProducts = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.numeric(3),
        price: faker.commerce.price(),
        status: true,
        stock: faker.string.numeric(1),
        category: faker.commerce.department(),
        thumbnails: [faker.image.url()]
    }
}

