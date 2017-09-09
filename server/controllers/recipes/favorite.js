import jwt from 'jsonwebtoken';
import { Recipe, Favorite } from '../../models';

const Favorites = (req, res) => { // -------------------------add recipe to fav and update recipe!
  const decoded = jwt.decode(req.query.token || req.Headers.token || req.body.token);
  if (!decoded) {
    return res.status(401).send({
      message: 'you have to be logged in',
    });
  }
  Recipe.findById(req.params.id)
    .then((recipe) => {
      if (!recipe) {
        res.status(404).send({
          message: 'recipe not found!',
        });
      } else {
        Favorite.findOne({
          where: {
            recipeId: req.params.id,
            userId: decoded.user.id,
          },
        })
          .then((success) => {
            if (!success) {
              Favorite.create({
                recipeId: req.params.id,
                userId: decoded.user.id,
              })
                .then(() => {
                  Recipe.findById(req.params.id)
                    .then((recipe) => {
                      recipe.update({
                        favUser: recipe.favUser.concat(decoded.user.email),
                      })
                        .then(() => res.status(201).send({
                          message: 'successfully added to favorites',
                        }))
                        .catch(error => res.status(500).send(error.toString()));
                    })
                    .catch(error => res.status(500).send(error.toString()));
                })
                .catch(error => res.status(500).send(error.toString()));
            } else {
              success.destroy()
                .then(() => {
                  Recipe.findById(req.params.id)
                    .then((recipe) => {
                      recipe.update({
                        favUser: recipe.favUser.splice(recipe.favUser.indexOf(decoded.user.email), 1),
                      })
                        .then(() => res.status(200).json({
                          message: 'successfully removed from favorites',
                        }))
                        .catch(error => res.status(500).send(error.toString()));
                    })
                    .catch(error => res.status(500).send(error.toString()));
                })
                .catch(error => res.status(500).send(error.toString()));
            }
          })
          .catch(error => res.status(500).send(error.toString()));
      }
    })
    .catch(error => res.status(500).send(error));
};
export default Favorites;
