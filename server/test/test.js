

import { expect } from 'chai';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';

const request = supertest(app);
const rootURL = '/api';
const recipesUrl = `${rootURL}/recipes`;
// const usersUrl = `${rootURL}/users`;

let data = {};
// only used to test actions that requires a logged in user
let userdata2;
// first and second user's token
let userToken1;
let userToken2;
// invalid because it won't exist on the user table
const invalidToken = jwt.sign({ userID: 15 }, 'jsninja', { expiresIn: '3 days' });
let recipeId;

describe('API Integration Tests', () => {
  describe('User signup', () => {
    const signupURl = `${rootURL}/users/signup`;
    beforeEach(() => {
      data = {
        password: '123456',
        email: 'example@user.com',
      };
    });

    it('return 201 for a successful account creation', (done) => {
      request.post(signupURl)
        .send(data)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal('account created');
          done();
        });
    });

    it('return 201 for a successful account creations', (done) => {
      userdata2 = Object.assign({}, data);
      console.log(userdata2);
      userdata2.email = 'test@test.com';
      request.post(signupURl)
        .send(userdata2)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal('account created');
          done();
        });
    });

    it('return 400 for an already existing email ', (done) => {
      const invalidData = Object.assign({}, data);
      invalidData.email = 'test@test.com';
      request.post(signupURl)
        .send(invalidData)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('email already exists');
          done();
        });
    });


    it('return 400 for if no email is passed ', (done) => {
      const invalidData = Object.assign({}, data);
      delete invalidData.email;

      request.post(signupURl)
        .send(invalidData)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('email is required');
          done();
        });
    });

    it('return 400 for if no password is passed ', (done) => {
      const invalidData = Object.assign({}, data);
      delete invalidData.password;

      request.post(signupURl)
        .send(invalidData)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('password is required');
          done();
        });
    });
  });


  describe('User login', () => {
    const loginURl = `${rootURL}/users/signin`;

    beforeEach(() => {
      data = {
        password: '123456',
        email: 'example@user.com',
      };
    });
    // main user login
    it('return 200 for a successful login', (done) => {
      request.post(loginURl)
        .send(data)
        .end((err, res) => {
          userToken1 = res.body.token;
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Successfully logged in');
          expect(userToken1).to.be.a('string');
          done();
        });
    });

    it('return 401 for wrong email and password', (done) => {
      const wrongPassword = Object.assign({}, data);
      wrongPassword.password = 'wrongpassword';
      wrongPassword.email = 'wrongpard';
      request.post(loginURl)
        .send(wrongPassword)
        .end((err, res) => {
          const wrongPasswordToken = res.body.token;
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('invalid login details');
          expect(wrongPasswordToken).to.be.a('undefined');
          done();
        });
    });

    it('return 200 for a successful login', (done) => {
      userdata2 = Object.assign({}, data);
      userdata2.email = 'test@test.com';
      request.post(loginURl)
        .send(userdata2)
        .end((err, res) => {
          userToken2 = res.body.token;
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Successfully logged in');
          expect(userToken2).to.be.a('string');
          done();
        });
    });

    it('return 400 for if email and password do not match', (done) => {
      const invalidData = Object.assign({}, data);
      invalidData.password = 'wrongpass';
      invalidData.email = 'wronguser';

      request.post(loginURl)
        .send(invalidData)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('invalid login details');
          done();
        });
    });

    it('return 400 for if no email is passed ', (done) => {
      const data = Object.assign({}, data);
      delete data.email;

      request.post(loginURl)
        .send(data)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('email field is required');
          done();
        });
    });
    
  });


  describe('Add Recipe', () => {
    beforeEach(() => {
      data = {
        title: 'Fried Rice',
        description: `Nigerian Fried Rice puts a spicy, flavorful spin on the traditional
             fried rice and is appealing on its own or served with a variety of other African food.`,
        category: 'dessert',
      };
    });

    // check if token is passed
    it('return 40 if token is not present', (done) => {
      request.post(recipesUrl)
        .send(data)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('you have to be logged in to create recipe');
          done();
        });
    });

    // test if name is passed when creating a recipe
    it('return 400 if recipe name is not passed', (done) => {
      const noName = Object.assign({}, data);
      noName.title = null;
      request.post(`${recipesUrl}?token=${userToken1}`)
        .send(noName)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('please fill in the required fields');
          done();
        });
    });

    it('return 201 if recipe is created', (done) => {
      const data = Object.assign({}, data);
      data.title = 'the first recipe';
      request.post(`${recipesUrl}?token=${userToken1}`)
        .send(data)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('recipe created');
          done();
        });
    });

    it('return 201 if recipe is created', (done) => {
      const data = Object.assign({}, data);
      data.title = 'the second recipe';
      request.post(`${recipesUrl}?token=${userToken2}`)
        .send(data)
        .end((err, res) => {
          recipeId = res.body.recipe.id;
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('recipe created');
          done();
        });
    });
  });
  
});

