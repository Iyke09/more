import { Recipe, Favorite } from '../../models';
import jwt from 'jsonwebtoken';

const userFavorite = (req, res) => { // -------------------------add recipe to fav and update recipe!
  const decoded = jwt.decode(req.query.token || req.body.token || req.headers.token);
  if (!decoded) {
    return res.status(401).send({
      message: 'you have to be logged in to create recipe',
    });
  }
  Recipe.findOne({ where: { id: req.params.id } })
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
                  Recipe.findOne({ where: { id: req.params.id } })
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
                  Recipe.findOne({ where: { id: req.params.id } })
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

export default userFavorite;
