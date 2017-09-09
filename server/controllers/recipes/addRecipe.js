import jwt from 'jsonwebtoken';
import { Recipe } from '../../models';

const addRecipe = (req, res) => { // -----------------------------create recipe!
  const decoded = jwt.decode(req.query.token || req.headers.token || req.body.token);
  if (!decoded) {
    return res.status(401).json({
      message: 'you have to be logged in to create recipe',
    });
  }
  console.log(req.body.img_url);
  return Recipe.create({
    title: req.body.title,
    category: req.body.category,
    image: req.body.img_url,
    description: req.body.description,
    instructions: req.body.instructions,
    ingredients: req.body.ingredients,
    userId: decoded.user.id,
  })
    .then(recipes => res.status(201).send({
      recipe: recipes,
      message: 'recipe created'
    }))
    .catch(error => res.status(400).send({
      message: error.errors[0].message
    }));
};

export default addRecipe;
