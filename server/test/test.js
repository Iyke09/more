

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
        email: 'enaho@gmail.com',
      };
    });

    it('return 201 for a successful account creation', (done) => {
      console.log(data)
      request.post(signupURl)
        .send(data)
        .end((err, res) => {
        console.log(res.body)
          // expect(res.status).to.equal(201);
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
          console.log('hooiii ' +  res.body)
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
        email: 'enaho@gmail.com',
      };
    });
    // main user login
    it('return 200 for a successful login', (done) => {
      request.post(loginURl)
        .send(data)
        .end((err, res) => {
          userToken1 = res.body.token;
          console.log(res)
          // expect(res.status).to.equal(200);
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
          recipeId = res.body.recipe.id;
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
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('recipe created');
          done();
        });
    });
  });

  describe('Add favorite Recipe', () => {
    it('return 201 if successfully added to favorites', (done) => {
      request.post(`${recipesUrl}/${recipeId}/fav`)
        .send({ token: userToken1 })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('successfully added to favorites');
          done();
        });
    });

    it('return 201 if another user tries to favorite', (done) => {
      request.post(`${recipesUrl}/${recipeId}/fav`)
        .send({ token: userToken2 })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('successfully added to favorites');
          done();
        });
    });

    it('return 201 if successfully removed from favorites', (done) => {
      request.post(`${recipesUrl}/${recipeId}/fav`)
        .send({ token: userToken1 })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('successfully removed from favorites');
          done();
        });
    });


    it('return 404 if recipe not found!!', (done) => {
      request.post(`${recipesUrl}/12/fav`)
        .send({ token: userToken1 })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('recipe not found!');
          done();
        });
    });
  });

  describe('Update Recipes', () => {
    it('return 401 if user not logged in', (done) => {
      request.put(`${recipesUrl}/${recipeId}`)
        .send({ token: userToken2 })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Unauthorization error');
          done();
        });
    });

    it('return 404 if recipe is not found', (done) => {
      request.put(`${recipesUrl}/15`)
        .send({ token: userToken1 })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('recipe Not Found');
          done();
        });
    });
  });

  describe('Send Review', () => {
    it('return 401 if user not logged in', (done) => {
      request.post(`${recipesUrl}/${recipeId}/review`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('you have to be logged in');
          done();
        });
    });

    it('return 401 content not filled', (done) => {
      request.post(`${recipesUrl}/${recipeId}/review`)
        .send({ title: 'hello', occupation: 'med', token: userToken1 })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('please fill in the required fields');
          done();
        });
    });
    it('return 200 if review successful', (done) => {
      request.post(`${recipesUrl}/${recipeId}/review`)
        .send({ title: 'hello', content: 'awesome dish', occupation: 'med', token: userToken2 })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('review sent!');
          done();
        });
    });

    it('return 404 if recipe is not found', (done) => {
      request.post(`${recipesUrl}/16/review`)
        .send({ title: 'hello', content: 'awesome dish', occupation: 'med', token: userToken1 })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('recipe not found');
          done();
        });
    });
  });

  describe('Upvote Recipes', () => {
    it('return 401 if user not owner of recipe', (done) => {
      request.get(`${recipesUrl}/${recipeId}/upvote`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('you have to be logged in');
          done();
        });
    });

    it('return 404 if recipe is not found', (done) => {
      request.get(`${recipesUrl}/15/upvote`)
        .send({ token: userToken1 })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('not Found');
          done();
        });
    });

    it('return 201 if recipe upvoted', (done) => {
      request.get(`${recipesUrl}/1/upvote`)
        .send({ token: userToken2 })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('recipe upvoted');
          done();
        });
    });

    it('return 201 when recipe upvote is removed', (done) => {
      request.get(`${recipesUrl}/1/upvote`)
        .send({ token: userToken2 })
        .end((err, res) => {
          console.log(res.body);
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('upvote removed');
          done();
        });
    });
  });

  describe('Downvote Recipes', () => {
    it('return 401 if user not owner of recipe', (done) => {
      request.get(`${recipesUrl}/${recipeId}/upvote`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('you have to be logged in');
          done();
        });
    });

    it('return 404 if recipe is not found', (done) => {
      request.get(`${recipesUrl}/15/downvote`)
        .send({ token: userToken1 })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('not Found');
          done();
        });
    });

    it('return 201 if recipe downvoted', (done) => {
      request.get(`${recipesUrl}/1/downvote`)
        .send({ token: userToken2 })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('recipe downvoted');
          done();
        });
    });

    it('return 201 when recipe downvote is removed', (done) => {
      request.get(`${recipesUrl}/1/downvote`)
        .send({ token: userToken2 })
        .end((err, res) => {
          console.log(res.body);
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('downvote removed');
          done();
        });
    });
  });

  describe('reply Review', () => {
    it('return 401 if user not logged in', (done) => {
      request.post(`${recipesUrl}/1/reply`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('you have to be logged in');
          done();
        });
    });

    it('return 200 if review successful', (done) => {
      request.post(`${recipesUrl}/1/reply`)
        .send({ title: 'hello', content: 'awesome dish', occupation: 'med', token: userToken1 })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('reply sent');
          done();
        });
    });

    it('return 404 if recipe is not found', (done) => {
      request.post(`${recipesUrl}/16/reply`)
        .send({ title: 'hello', content: 'awesome dish', occupation: 'med', token: userToken1 })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('not found');
          done();
        });
    });
  });

  describe('Upvote Recipes', () => {
    it('return 401 if user not owner of recipe', (done) => {
      request.get(`${recipesUrl}/${recipeId}/upvote`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('you have to be logged in');
          done();
        });
    });

    it('return 404 if recipe is not found', (done) => {
      request.get(`${recipesUrl}/15/upvote`)
        .send({ token: userToken1 })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('not Found');
          done();
        });
    });

    it('return 201 if recipe upvoted', (done) => {
      request.get(`${recipesUrl}/1/upvote`)
        .send({ token: userToken2 })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('recipe upvoted');
          done();
        });
    });

    it('return 201 when recipe upvote is removed', (done) => {
      request.get(`${recipesUrl}/1/upvote`)
        .send({ token: userToken2 })
        .end((err, res) => {
          console.log(res.body);
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('upvote removed');
          done();
        });
    });
  });

  describe('Downvote Recipes', () => {
    it('return 401 if user not owner of recipe', (done) => {
      request.get(`${recipesUrl}/${recipeId}/upvote`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('you have to be logged in');
          done();
        });
    });

    it('return 404 if recipe is not found', (done) => {
      request.get(`${recipesUrl}/15/downvote`)
        .send({ token: userToken1 })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('not Found');
          done();
        });
    });

    it('return 201 if recipe downvoted', (done) => {
      request.get(`${recipesUrl}/1/downvote`)
        .send({ token: userToken2 })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('recipe downvoted');
          done();
        });
    });

    it('return 201 when recipe downvote is removed', (done) => {
      request.get(`${recipesUrl}/1/downvote`)
        .send({ token: userToken2 })
        .end((err, res) => {
          console.log(res.body);
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('downvote removed');
          done();
        });
    });
  });

  describe('Delete Recipes', () => {
    it('return 401 if user not owner of recipe', (done) => {
      request.delete(`${recipesUrl}/${recipeId}`)
        .send({ token: userToken2 })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Not Authorized');
          done();
        });
    });

    it('return 404 if recipe is not found', (done) => {
      request.delete(`${recipesUrl}/15`)
        .send({ token: userToken1 })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('recipe Not Found');
          done();
        });
    });

    it('return 404 if recipe deleted', (done) => {
      request.delete(`${recipesUrl}/${recipeId}`)
        .send({ token: userToken1 })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('recipe deleted');
          done();
        });
    });
  });

});
  


