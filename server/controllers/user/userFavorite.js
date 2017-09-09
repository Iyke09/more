import { User, Recipe, Favorite } from '../../models';
import jwt from 'jsonwebtoken';

const userFavorite = (req, res) => {
  const decoded = jwt.decode(req.query.token);
  if (!decoded) {
    return res.status(401).send({
      message: 'you have to be logged in to create recipe',
    });
  }
  User.findById(req.params.id, {
    include: [{
      model: Favorite,
      as: 'favorites',
      include: [{
        model: Recipe,
        as: 'check',
        // required: false
      }],
    }],
  })
    .then(recipe => res.status(200).send(recipe))
    .catch(error => res.status(400).send(error.toString()));
};

export default userFavorite;
