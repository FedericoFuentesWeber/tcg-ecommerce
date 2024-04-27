import { expect } from "chai";
import pkg from "supertest";

const supertest = pkg;
const requester = supertest('http://localhost:8080');

describe('Set de test para los productos', () => {
    before(function() {

    })
    beforeEach(function() {
        this.timeout(5000);
    })

    describe('Products Router', () => {
        it('Should return a list of products', async () => {
          const {
            statusCode,
            ok,
            _body
          } = await requester.get('/api/products');

          console.log(statusCode);
          console.log(ok);
          console.log(_body);
          expect(_body.payload).to.be.an('array');
        });
      });
})