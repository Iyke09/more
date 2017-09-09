'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    recipeId: DataTypes.INTEGER,
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: {
          args: 10,
          msg: `description must start be a letter, have no spaces,
            and be at least 10 characters.`
        },
        max: {
          args: 250,
          msg: `description must start with a letter, have no spaces,
            and be at less than 250 characters.`
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: 'The email you entered is not valid',
        }
      }
    },
    occupation: DataTypes.STRING,
    reply: DataTypes.ARRAY(DataTypes.STRING),
  });

  // Comment.associate = (models) => {
  //   Comment.belongsTo(models.Recipe, {
  //     foreignKey: 'recipeId',
  //     as: 'comments',
  //   });
  // };

  return Comment;
};
