import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Recipe, Favorite, User } from '../models';

const router = express.Router();


router.get('/', (req, res) => res.status(200).send({
  message: 'Welcome to the your Favorite API!',
}));

router.post('/signup', (req, res) => { // --------------------------checked
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

router.post('/signin/', (req, res) => { // ----------------------------checked
  if (!req.body.email) {
    return res.status(400).json({
      message: 'email field is required',
    });
  }
  if (!req.body.password) {
    return res.status(400).json({
      message: 'password field is required',
    });
  }
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).send({
          message: 'invalid login details',
        });
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(400).send({
          message: 'Incorrect password',
        });
      }
      const token = jwt.sign({ user }, 'secret', { expiresIn: 7200 });
      res.status(200).send({
        message: 'Successfully logged in',
        token,
        userId: user.id,
      });
    })
    .catch(error => res.status(400).send(error));
},
);

module.exports = router;
