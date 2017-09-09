import { User } from '../../models';
import bcrypt from 'bcryptjs';

const signup = (req, res) => {
  if (!req.body.password) {
    return res.status(400).json({
      message: 'password field is required',
    });
  }
  if (req.body.password) {
    if (req.body.password.length < 4 || req.body.password.length > 30) {
      return res.status(400).json({
        message: 'password must be atleast 6 characters and less than 30',
      });
    }
  }
  if (req.body.username) {
    if (req.body.username.length < 4) {
      return res.status(400).json({
        message: 'username must be atleast 4 characters',
      });
    }
  }
  // if (req.body.password.indexOf(/\n/)) {
  //   return res.status(400).json({
  //     message: 'password must be atleast 6 characters and without space',
  //   });
  // }

  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  })
    .then(() => res.status(201).json({
      status: 'success',
      message: 'account created',
    }))
    .catch((error) => (
      res.status(500).json({ message: error.errors[0].message })
    ));
};
export default signup;

