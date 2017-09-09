import { Recipe, Views } from '../../models';
import jwt from 'jsonwebtoken';

const viewRecipe = (req, res) => { // -------------------------add recipe to fav and update recipe!
  const decoded = jwt.decode(req.query.token || req.Headers.token || req.body.token);
  if (!decoded) {
    return res.status(401).send({
      message: 'you have to be logged in',
    });
  }
  Views.findOne({
    where: {
      recipeId: req.params.id,
      userId: decoded.user.id,
    },
  })
    .then((success) => {
      if (!success) {
        Views.create({
          recipeId: req.params.id,
          userId: decoded.user.id,
          viewId: req.params.id,
        })
          .then(() => {
            Views.findAndCountAll({
              where: {
                recipeId: req.params.id,
              },
            })
              .then((count) => {
                Recipe.findById(req.params.id)
                  .then((recipe) => {
                    recipe.update({
                      views: count.count,
                    })
                      .then(update => res.status(200).send({
                        message: 'updated',
                        recipe: update,
                      }))
                      .catch(error => res.status(401).send(error));
                  })
                  .catch(error => res.status(401).send(error));
              })
              .catch(error => res.status(401).send(error));
          });
      } else {
        Views.findAndCountAll({
          where: {
            recipeId: req.params.id,
          },
        })
          .then((count) => {
            Recipe.findById(req.params.id)
              .then((recipe) => {
                recipe.update({
                  views: count.count,
                })
                  .then(update => res.status(201).send(update))
                  .catch(error => res.status(401).send(error));
              })
              .catch(error => res.status(401).send(error));
          })
          .catch(error => res.status(401).send(error));
      }
    })
    .catch(error => res.status(400).send(error));
};

export default viewRecipe;
