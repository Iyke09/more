import { Recipe } from '../../models';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const updateRecipe = (req, res) => { // ---------- send email if user's fav recipe gets updated
  const decoded = jwt.decode(req.body.token || req.body.query || req.headers.token);
  Recipe.findOne({ where: { id: req.params.id } })
  .then((recipe) => {
    if (!recipe) {
      return res.status(404).send({
        message: 'recipe Not Found',
      });
    }
    if (recipe.userId !== decoded.user.id) {
      return res.status(401).json({
        message: 'Unauthorization error',
      });
    }
    return recipe
      .update({
        title: req.body.title || recipe.title,
        description: req.body.description || recipe.description,
        category: req.body.category || recipe.category,
        image: req.body.image || recipe.image,
        ingredients: req.body.ingredients || recipe.ingredients,
        instructions: req.body.instructions || recipe.instructions,
        userId: decoded.user.id || recipe.userId
      })
      .then((success) => {
        if (success.favUser.length > 1) {
          const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'iykay33@gmail.com',
              pass: 'p3nn1s01',
            },
          });
          for (const x of success.favUser) {
            const mailOptions = {
              from: 'iykay33@gmail.com',
              to: x,
              subject: 'Email example2',
              text: 'Hello User,your favorite recipe has been updated',
            };
            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.log(`hiiiii err ${err}`);
              } else {
                console.log(`Message sent: ${info.response}`);
              }
            });
          }
          res.status(201).send(success);
        }
        res.status(201).send(success);
      })
      .catch(error => res.status(500).send({
        message: error.errors[0].message
      }));
  })
    .catch(error => res.status(400).send(error));
};

export default updateRecipe;
