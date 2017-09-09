import jwt from 'jsonwebtoken';
import { User, Favorite, Recipe } from '../../models';

const userFavorite = (req, res) => { // -------------------------#
  const decoded = jwt.decode(req.headers.token || req.body.token);
  if (!decoded) {
    return res.status(401).send({
      message: 'you have to be logged in to create recipe',
    });
  }
  User.findById(req.params.id)
  .then((user) => {
    if (!user) {
      res.status(404).send('user not found');
    } else {
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
    }
  })
  .catch(error => res.status(400).send(error.toString()));
};

export default userFavorite;

