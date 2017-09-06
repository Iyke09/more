

module.exports = (sequelize, DataTypes) => {
  const Views = sequelize.define('Views', {
    userId: DataTypes.INTEGER,
    recipeId: DataTypes.INTEGER,
    viewId: DataTypes.INTEGER,
  });

  Views.associate = (models) => {
    Views.belongsTo(models.Recipe, {
      foreignKey: 'viewId',
      as: 'recipe',
    });
  };
  return Views;
};


