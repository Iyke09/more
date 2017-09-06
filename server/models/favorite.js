

module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    userId: DataTypes.INTEGER,
    recipeId: DataTypes.INTEGER,
    cartId: DataTypes.INTEGER,
  });


  Favorite.associate = (models) => {
    Favorite.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });

    Favorite.belongsTo(models.Category, {
      foreignKey: 'cartId',
      as: 'category',
    });

    Favorite.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      as: 'check',
    });
  };


  return Favorite;
};
