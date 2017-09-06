

module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define('Recipe', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    category: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    upvote: DataTypes.INTEGER,
    downvote: DataTypes.INTEGER,
    views: DataTypes.INTEGER,
    favUser: DataTypes.ARRAY(DataTypes.STRING),
  });

  Recipe.associate = (models) => {
    Recipe.hasMany(models.Votes, {
      foreignKey: 'recipeId',
      as: 'votes',
    });

    Recipe.hasMany(models.Comment, {
      foreignKey: 'recipeId',
      as: 'comments',
    });

    Recipe.hasMany(models.Views, {
      foreignKey: 'viewId',
      as: 'viewsz',
    });

    Recipe.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });

    Recipe.hasMany(models.Favorite, {
      foreignKey: 'recipeId',
      as: 'check',
    });

    // Recipe.hasMany(models.Favorite, {
    //   foreignKey: 'recipeId',
    //   as:'check'
    // })
  };


  return Recipe;
};
