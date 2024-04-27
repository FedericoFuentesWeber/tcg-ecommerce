import { expect } from "chai";
import pkg from "supertest";

const supertest = pkg;
const requester = supertest('http://localhost:8080');

describe('Set de test para los carritos', () => {
    before(function() {

    })
    beforeEach(function() {
        this.timeout(5000);
    })

    describe('Carts Router', () => {
        it('should return a list of carts', async () => {
            const mockCart = {
                products: []
            }

            const {
              statusCode,
              ok,
              _body
            } = await requester.post('/api/carts').send(mockCart);
          
            console.log(statusCode);
            console.log(ok);
            console.log(_body);
            expect(_body).to.have.property('cartId');
        });
      });
})