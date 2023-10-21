import { expect } from 'chai';
import mongoose from 'mongoose';
import ProductManagerService from '../../src/services/products/products.manager.service.js';
import Product from '../../src/models/schema/products.schema.js';
import Config from '../../src/config/config.js';

describe('Product Manager Service', () => {
    let productService;

    before(async () => {
        // Establece la conexión a la base de datos
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conexión a la base de datos establecida');
    });

    after(async () => {
        // Cierra la conexión a la base de datos después de todas las pruebas
        await mongoose.disconnect();
        console.log('Desconexión de la base de datos');
    });

    beforeEach(() => {
        productService = new ProductManagerService();
    });

    it('Test 1 Deberia agregar un producto', async () => {
        const newProduct = {
            title: 'Test Product',
            category: 'Test Category',
            description: 'Test Description',
            price: 50,
            thumbnail: 'test-thumbnail.jpg',
            code: 'ABC1234',
            status: true,
            stock: 10,
            owner: 'test@example.com'
        };

        productService.setSaveBehavior(async () => newProduct);

        const result = await productService.addProduct(newProduct);
        expect(result).to.exist;
    });

    it('Test 2 - Deberia traer una lista de productos', async () => {
        const result = await productService.getProducts();
        expect(result).to.exist;
    });

    it('Test 3 - Deberia traer un producto por su ID', async () => {
        const productId = '653404c9ea55a6b89fbda893';
        const result = await productService.getProductById(productId);
        expect(result).to.exist;
    });

    it('Test 4 - Deberia Actualizar un producto por su ID', async () => {
        const productId = '653404c9ea55a6b89fbda893';
        const newData = { title: 'Updated Product' };

        // Actualizar el producto
        const updatedProduct = await productService.updateProduct(productId, newData);
        expect(updatedProduct).to.exist;
    });

    it('Test 5 - Deberia borrar un producto por ID', async () => {
        const productId = '653404c9ea55a6b89fbda893';
        const result = await productService.deleteProduct(productId);
        expect(result).to.exist;
    });

    it('Test 6 - Deberia traer el Owner del producto segun ID', async () => {
        const productId = '653404c9ea55a6b89fbda893';
        const result = await productService.getProductOwner(productId);
        expect(result).to.exist;
    });
});
