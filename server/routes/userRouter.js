import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Recipe, Favorite, User } from '../models';

const router = express.Router();


router.get('/', (req, res) => res.status(200).send({
  message: 'Welcome to the your Favorite API!',
}));

router.post('/signup', (req, res) => {
  if (!req.body.password && !req.body.email) {
    res.status(400).json({
      message: 'both fields are required',
    });
  }
  if (!req.body.email) {
    res.status(400).json({
      message: 'email is required',
    });
  }
  if (!req.body.password) {
    res.status(400).json({
      message: 'password is required',
    });
  }
  User.findOne({
    where: { email: req.body.email },
  })
    .then((user) => {
      if (!user) {
        User.create({
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10),
        })
          .then(() => res.status(201).json({
            status: 'success',
            message: 'account created',
          }))
          .catch(error => res.status(500).send(error));
      } else {
        res.status(400).json({
          message: 'email already exists',
        });
      }
    })
    .catch(error => res.status(500).send(error));
});


module.exports = router;
