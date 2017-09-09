import createRecipe from './addRecipe';
import updateRecipe from './updateRecipe';
import deleteRecipe from './deleteRecipe';
import favoriteRecipe from './favoriteRecipe';
import reviewRecipe from './reviewRecipe';
import upvoteRecipe from './upvote';
import downvoteRecipe from './downvote';
import sortRecipe from './sortRecipe';
import allRecipe from './allRecipe';
import viewRecipe from './viewRecipe';

const recipesController = {
  createRecipe,
  upvoteRecipe,
  downvoteRecipe,
  viewRecipe,
  updateRecipe,
  deleteRecipe,
  favoriteRecipe,
  allRecipe,
  reviewRecipe,
  sortRecipe
};

export default recipesController;
