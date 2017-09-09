import addRecipe from './addRecipe';
import allRecipe from './allRecipes';
import updateRecipe from './updateRecipe';
import deleteRecipe from './deleteRecipe';
import upvoteRecipe from './upvote';
import downvoteRecipe from './downvote';
import Favorites from './favorite';
import reviewRecipe from './review';
import sortRecipe from './sortRecipe';
import viewRecipe from './views';

const recipesController = {
  allRecipe,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  downvoteRecipe,
  upvoteRecipe,
  Favorites,
  reviewRecipe,
  sortRecipe,
  viewRecipe
};
export default recipesController;
