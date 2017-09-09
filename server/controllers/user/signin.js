import { User } from '../../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const signin = (req, res) => { // ----------------------------checked
  if (!req.body.password) {
    return res.status(400).json({
      message: 'password field is required',
    });
  }
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).send({
          message: 'Invalid email or password...Try again?',
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
    .catch(error => res.status(400).send(error));
};
export default signin;
