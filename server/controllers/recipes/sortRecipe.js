import { Recipe } from '../../models';

const sortRecipe = (req, res) => {
  Recipe.findAll({ order: [['upvote', 'DESC']] })
    .then(recipe => res.status(200).send(recipe))
    .catch(error => res.status(400).send(error.toString()));
};

export default sortRecipe;
