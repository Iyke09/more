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

router.put('/:id', (req, res) => { // ---------- send email if user's fav recipe gets updated
  const decoded = jwt.decode(req.body.token);
  Recipe.findById(req.params.id)
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).send({
          message: 'recipe Not Found',
        });
      }
      if (recipe.userId !== decoded.user.id) {
        return res.status(401).json({
          message: 'Unauthorization error',
        });
      }
      return recipe
        .update({
          title: req.body.title || recipe.title,
          description: req.body.description || recipe.description,
          category: req.body.category || recipe.category, // chinese
          upvote: req.body.upvote || recipe.upvote,
          downvote: req.body.downvote || recipe.downvote,
          userId: decoded.user.id || recipe.user,
          // favorite: req.body.fav
        })
        .then((success) => {
          if (success.favUser.length > 1) {
            const transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                user: 'iykay33@gmail.com',
                pass: 'p3nn1s01',
              },
            });
              for (const x of success.favUser) {
                const mailOptions = {
                  from: 'iykay33@gmail.com',
                  to: x,
                  subject: 'Email example2',
                  text: 'Hello User,your favorite recipe has been updated',
                };
                transporter.sendMail(mailOptions, (err, info) => {
                  if (err) {
                    console.log(`hiiiii err ${err}`);
                  } else {
                    res.json({
                      message: info.response,
                    });
                    console.log(`Message sent: ${info.response}`);
                }
              });
            }
            res.status(201).send(success);
          }
          res.status(201).send(success);
        })
        .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
},
);

router.delete('/:id', (req, res) => { // -------------------- delete recipe
  const decoded = jwt.decode(req.body.token || req.query.token);
  Recipe.findById(req.params.id)
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).send({
          message: 'recipe Not Found',
        });
      }
      if (recipe.userId != decoded.user.id) {
        return res.status(401).json({
          message: 'Not Authorized',
        });
      }
      return recipe
        .destroy()
        .then(() => res.status(200).send({ message: 'recipe deleted' })) // Send back the updated todo.
        .catch(error => res.status(400).send(error.toString()));
      })
    .catch(error => res.status(400).send(error.toString()));
},
);

router.post('/:id/review', (req, res) => { // ---------------------add review and alert owner of recipe
  const decoded = jwt.decode(req.query.token || req.body.token);
  if (!decoded) {
    return res.status(401).send({
      message: 'you have to be logged in',
    });
  }
  if (!req.body.content) {
    return res.status(401).send({
      message: 'please fill in the required fields',
    });
  }
  Recipe.findById(req.params.id)
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).send({
          message: 'recipe not found',
        });
      }
      User.findById(recipe.userId)
        .then((user) => {
          Comment.create({
            recipeId: req.params.id,
            content: req.body.content,
            email: req.body.email,
            occupation: req.body.occupation,
          })
            .then(() => {
              const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                  user: 'iykay33@gmail.com',
                  pass: 'p3nn1s01',
                },
              });
              const mailOptions = {
                from: 'iykay33@gmail.com',
                to: user.email,
                subject: 'Recipe Review',
                text: 'Hello there,youre recipe just got a review! ',
              };
              transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                  console.log(err);
                } else {
                  res.json({
                    message: info.response,
                  });
                  console.log(`Message sent: ${info.response}`);
                }
              });
              return res.status(200).send({ message: 'review sent!' });
            })
            .catch(error => res.status(400).send(error.toString()));
        })
        .catch(error => res.status(400).send(error.toString()));
    })
    .catch(error => res.status(400).send(error.toString()));
},
);

router.get('/:id/upvote', (req, res) => { // ------------------upvotes#####
  const decoded = jwt.decode(req.query.token || req.body.token);
  if (!decoded) {
    return res.status(401).send({
      message: 'you have to be logged in',
    });
  }
  Recipe.findById(req.params.id)
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).send({
          message: 'not Found',
        });
      }
      Votes.findOne({
        where: {
          recipeId: req.params.id,
          userId: decoded.user.id,
        },
      })
        .then((votes) => {
          if (!votes) {
            Votes.create({
              recipeId: req.params.id,
              userId: decoded.user.id,
              votes: true,
            })
              .then(() => {
                Votes.findAndCountAll({
                  where: {
                    recipeId: req.params.id,
                  },
                })
                  .then((count) => {
                    Recipe.findById(req.params.id)
                      .then((recipe) => {
                        recipe.update({
                          upvote: count.count,
                        })
                          .then(() => res.status(201).send({
                            message: 'recipe upvoted',
                          }))
                          .catch(error => res.status(401).send(error));
                      })
                      .catch(error => res.status(401).send(error));
                  })
                  .catch(error => res.status(401).send(error));
              })
              .catch(error => res.status(401).send(error));
          }
          votes
            .destroy()
            .then(() => {
              Votes.findAndCountAll({
                where: {
                  recipeId: req.params.id,
                },
              })
                .then((count) => {
                  Recipe.findById(req.params.id)
                    .then((recipe) => {
                      recipe.update({
                        upvote: count.count,
                      })
                        .then(() => res.status(201).send({
                          message: 'upvote removed',
                        }))
                        .catch(error => res.status(401).send(error));
                    })
                    .catch(error => res.status(401).send(error));
                })
                .catch(error => res.status(401).send(error));
            })
            .catch(error => res.status(401).send(error));
        });
    })
    .catch(error => res.status(400).send(error.toString()));
});

router.get('/:id/downvote', (req, res) => { // ------------------upvotes#####
  const decoded = jwt.decode(req.query.token || req.body.token);
  if (!decoded) {
    return res.status(401).send({
      message: 'you have to be logged in',
    });
  }
  Recipe.findById(req.params.id)
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).send({
          message: 'not Found',
        });
      }
      Votes.findOne({
        where: {
          recipeId: req.params.id,
          userId: decoded.user.id,
        },
      })
        .then((votes) => {
          if (!votes) {
            Votes.create({
              recipeId: req.params.id,
              userId: decoded.user.id,
              votes: false,
            })
              .then((success) => {
                Votes.findAndCountAll({
                  where: {
                    recipeId: req.params.id,
                  },
                })
                  .then((count) => {
                    Recipe.findById(req.params.id)
                      .then((recipe) => {
                        recipe.update({
                          upvote: count.count,
                        })
                          .then(update => res.status(201).send({
                            message: 'recipe downvoted',
                          }))
                          .catch(error => res.status(401).send(error));
                      })
                      .catch(error => res.status(401).send(error));
                  })
                  .catch(error => res.status(401).send(error));
              })
              .catch(error => res.status(401).send(error));
          }
          votes
            .destroy()
            .then(() => {
              Votes.findAndCountAll({
                where: {
                  recipeId: req.params.id,
                },
              })
                .then((count) => {
                  Recipe.findById(req.params.id)
                    .then((recipe) => {
                      recipe.update({
                        upvote: count.count,
                      })
                        .then(() => res.status(201).send({
                          message: 'downvote removed',
                        }))
                        .catch(error => res.status(401).send(error));
                    })
                    .catch(error => res.status(401).send(error));
                })
                .catch(error => res.status(401).send(error));
            })
            .catch(error => res.status(401).send(error));
        });
    })
    .catch(error => res.status(400).send(error.toString()));
});


module.exports = router;
