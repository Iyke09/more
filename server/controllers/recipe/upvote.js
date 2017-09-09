import { Recipe, Votes } from '../../models';
import jwt from 'jsonwebtoken';

const upvote = (req, res) => { // ------------------upvotes#####
  const decoded = jwt.decode(req.headers.token || req.body.token);
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
                        .catch(error => res.status(401).send(error.toString()));
                    })
                    .catch(error => res.status(401).send(error.toString()));
                })
                .catch(error => res.status(401).send(error.toString));
            })
            .catch(error => res.status(401).send(error.toString));
        });
    })
    .catch(error => res.status(400).send(error.toString()));
};

export default upvote;
