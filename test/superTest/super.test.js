import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect 

const requester = supertest('http://localhost:8080')

describe ('Super Test 1', ()=>{
    it('Prueba -- POST [POST] /products/create Crear producto', async()=>{
        const mockProduct = {
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
        const result = await requester.post('/products/create').send(mockProduct)
        console.log(result)
    })
})