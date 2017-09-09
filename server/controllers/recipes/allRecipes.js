import { Recipe } from '../../models';

const allRecipe = (req, res) => {
  Recipe.findAll()
    .then(recipe => res.status(200).send(recipe))
    .catch(error => res.status(400).send(error.toString()));
};


export default allRecipe;
