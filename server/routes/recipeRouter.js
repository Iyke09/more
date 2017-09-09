import express from 'express';
import recipeController from '../controllers/recipe';

const router = express.Router();

router.post('/', recipeController.createRecipe);

router.get('/', recipeController.allRecipe);

router.post('/:id/fav', recipeController.favoriteRecipe);

router.put('/:id', recipeController.updateRecipe);

router.delete('/:id', recipeController.deleteRecipe);

router.post('/:id/review', recipeController.reviewRecipe);

router.get('/sort', recipeController.sortRecipe);

router.post('/:id/upvote', recipeController.upvoteRecipe);

router.post('/:id/downvote', recipeController.downvoteRecipe);

router.post('/:id/views', recipeController.viewRecipe);


module.exports = router;
