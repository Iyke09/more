import jwt from 'jsonwebtoken';
import { Recipe } from '../../models';

const deleteRecipe = (req, res) => { // -------------------- delete recipe
  const decoded = jwt.decode(req.query.token || req.Headers.token || req.body.token);
  Recipe.findById(req.params.id)
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).send({
          message: 'recipe Not Found',
        });
      }
      if (recipe.userId !== decoded.user.id) {
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
};

export default deleteRecipe;
