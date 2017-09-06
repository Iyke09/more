import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { Recipe, Comment, Favorite, Votes, Category, Views, User } from '../models';

const router = express.Router();

router.post('/', (req, res) => { // -----------------------------create recipe!
  const decoded = jwt.decode(req.query.token);
  if (!decoded) {
    return res.status(401).json({
      message: 'you have to be logged in to create recipe',
    });
  }
  if (req.body.title === null || req.body.description === null || req.body.category === null) {
    return res.status(400).json({
      message: 'please fill in the required fields',
    });
  }
  return Recipe.create({
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    userId: decoded.user.id,
  })
    .then(recipes => res.status(201).send({
      recipe: recipes,
      message: 'recipe created',
    }))
    .catch(error => res.status(400).send(error.toString()));
});

router.get('/:id/fav', (req, res) => { // ------------------checked
  User.findById(req.params.id, {
    include: [{
      model: Favorite,
      as: 'favorites',
    }],
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'user Not Found',
        });
      }
      return res.status(200).send(user);
    })
    .catch(error => res.status(400).send(error.toString()));
});
