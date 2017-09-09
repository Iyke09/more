module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Oops. An account already exist with this username',
        // fields: [sequelize.fn('lower', sequelize.col('email'))]
      },
      validate: {
        min: {
          args: 3,
          msg: `Username must start with a letter, have no spaces,
            and be at least 3 characters.`
        },
        max: {
          args: 40,
          msg: `Username must start with a letter, have no spaces,
            and be at less than 40 characters.`
        },
        is: {
          args: /^[A-Za-z][A-Za-z0-9-]+$/i,
          msg: `Username must start with a letter, have no spaces,
            and be 3 - 40 characters.`
        }
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: `Oops. Looks like you already have an account
          with this email address. Please try and login`,
        // fields: [sequelize.fn('lower', sequelize.col('email'))]
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'The email you entered is not valid',
        },
        max: {
          args: 254,
          msg: 'The email you entered is invalid or longer than 254 characters.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [7],
          msg: 'The password you entered is less than 7 character s'
        },
      },
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Recipe, {
      foreignKey: 'userId',
      as: 'recipes',
    });

    User.hasMany(models.Favorite, {
      foreignKey: 'userId',
      as: 'favorites',
    });
  };

  return User;
};

