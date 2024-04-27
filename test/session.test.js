import { expect } from "chai";
import pkg from "supertest";

const supertest = pkg;
const requester = supertest('http://localhost:8080');

describe('Set de test para las sessions', () => {
    before(function() {

    })
    beforeEach(function() {
        this.timeout(5000);
    })
      
    describe('Login Endpoint', () => {
        it('should return a valid token and set cookieToken', async () => {
            const userData = {
                email: 'ffuentesweber@gmail.com',
                password: '123456'
            };
      
            const {
              statusCode,
              ok,
              _body
            } = await requester
              .post('/api/sessions/login')
              .send(userData)
      
            console.log(statusCode);
            console.log(ok);
            console.log(_body);
            expect(_body.status).to.equal('success');
            expect(_body.usersCreate).to.equal('Login success');
        });
      });
})