import { expect } from "chai";
import supertest from 'supertest'
import { dropProduct } from "../setup.test.js";


const requester = supertest('http://localhost:8080')

describe ('Product Router case test', ()=>{

    it('[POST] /products/create Crear producto', async()=>{
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