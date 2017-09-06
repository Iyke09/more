import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Recipe, Favorite, User } from '../models';

const router = express.Router();


router.get('/', (req, res) => res.status(200).send({
  message: 'Welcome to the your Favorite API!',
}));


module.exports = router;
