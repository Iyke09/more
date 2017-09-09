import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { Recipe, User, Comment } from '../../models';


const reviewRecipe = (req, res) => { // ---------------------add review and alert owner of recipe
  const decoded = jwt.decode(req.query.token || req.Headers.token || req.body.token);
  if (!decoded) {
    return res.status(401).send({
      message: 'you have to be logged in',
    });
  }
  if (!req.body.content) {
    return res.status(401).send({
      message: 'please fill in the required fields',
    });
  }
  Recipe.findById(req.params.id)
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).send({
          message: 'recipe not found',
        });
      }
      User.findById(recipe.userId)
        .then((user) => {
          Comment.create({
            recipeId: req.params.id,
            content: req.body.content,
            email: req.body.email,
            occupation: req.body.occupation,
          })
            .then(() => {
              const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                  user: 'iykay33@gmail.com',
                  pass: 'p3nn1s01',
                },
              });
              const mailOptions = {
                from: 'iykay33@gmail.com',
                to: user.email,
                subject: 'Recipe Review',
                text: 'Hello there,youre recipe just got a review! ',
              };
              transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                  console.log(err);
                } else {
                  res.json({
                    message: info.response,
                  });
                  console.log(`Message sent: ${info.response}`);
                }
              });
              return res.status(200).send({ message: 'review sent!' });
            })
            .catch(error => res.status(400).send({
              message: error.errors[0].message
            }));
        })
        .catch(error => res.status(400).send({
          message: error.errors[0].message
        }));
    })
    .catch(error => res.status(400).send({
      message: error.errors[0].message
    }));
};

export default reviewRecipe;
