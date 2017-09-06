import express from 'express';

import user from './userRouter';
import recipe from './recipeRouter';

const route = express.Router();

route.use('/users',user);
route.use('/recipes',recipe);

module.exports = route;

