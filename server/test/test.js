

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

  })
})

