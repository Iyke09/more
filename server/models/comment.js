'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    recipeId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    email: DataTypes.STRING,
    occupation: DataTypes.STRING,
    reply: DataTypes.ARRAY(DataTypes.STRING),
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      as: 'comments',
    })
  };

  return Comment;
};
