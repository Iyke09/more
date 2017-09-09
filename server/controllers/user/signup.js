import bcrypt from 'bcryptjs';
import { User } from '../../models';

const signup = (req, res) => { // --------------------------checked
  // if (!req.body.email) {
  //   return res.status(400).json({
  //     message: 'email is required',
  //   });
  // }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return res.status(400).json({
        message: 'password must be greater than 6 characters',
      });
    }
  }

  if (req.body.username) {
    if (req.body.username.length < 4) {
      res.status(400).json({
        message: 'username must be greater than 4 characters',
      });
    }
  }

  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  })
    .then(() => res.status(201).json({
      status: 'success',
      message: 'account created',
    }))
    .catch(error => res.status(500).send({
      message: error.errors[0].message
    }));
};

export default signup;
