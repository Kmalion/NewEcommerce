import { expect } from "chai";
import supertest from "supertest"; // Agrega esta línea
import { UsersController } from "../../src/controllers/users.controller.js";
import ProductManagerService from "../../src/services/products/products.manager.service.js";
import CartsServiceManager from "../../src/services/carts/carts.manager.service.js";

let requester = supertest('http://localhost:8080');

describe('Product Router case test', async () => {
    let authToken;
    let productService;
    const cartsService = new CartsServiceManager();

    before(async () => {
        try {
            const mockUser = {
                username: process.env.TEST_USER,
                password: process.env.TEST_USER_PASSWORD
            };

            // Simulamos la autenticación
            const response = await requester.post('/auth/login-auth').send(mockUser);
            authToken = response.body.token;

        } catch (error) {
            console.error('Error en la obtención del token:', error);
            throw error;
        }
    });

    beforeEach(() => {
        productService = new ProductManagerService();
    });

    it('[POST] /products/create Crear producto', async () => {
        try {
            const mockProduct = {
                title: 'Test Product',
                category: 'Test Category',
                description: 'Test Description',
                price: 50,
                thumbnail: 'test-thumbnail.jpg',
                code: 'ABC132233387755',
                status: true,
                stock: 10,
                owner: 'test@example.com'
            };

            const response = await requester.post('/products/create')
                .send(mockProduct)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).to.be.eql(200);

        } catch (error) {
            console.error('Error en la prueba de crear producto:', error);
            throw error;
        }
    });

    it('[POST] /cart/add/:pid Agrega producto en Carrito', async () => {
        const cartId = '64fe53a02677ff319bd3981d';
        const productId = '65346f90b429513c445673d6';

        try {
            const response = await requester.post(`/cart/add/${productId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).to.be.eql(200);

        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            throw error;
        }
    });
});
