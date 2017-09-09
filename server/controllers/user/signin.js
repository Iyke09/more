import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models';

const signin = (req, res) => { // ----------------------------checked
  // if (!req.body.email) {
  //   return res.status(400).json({
  //     message: 'email field is required',
  //   });
  // }
  // if (!req.body.password) {
  //   return res.status(400).json({
  //     message: 'password field is required',
  //   });
  // }
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).send({
          message: 'invalid login details',
        });
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(400).send({
          message: 'Incorrect password',
        });
      }
      const token = jwt.sign({ user }, 'secret', { expiresIn: 7200 });
      res.status(200).send({
        message: 'Successfully logged in',
        token,
        userId: user.id,
      });
    })
    .catch(error => res.status(500).send({
      message: error.errors[0].message
    }));
};

export default signin;
