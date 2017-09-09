//  'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    userId: DataTypes.INTEGER,
    cart_name: DataTypes.STRING,
    cartId: DataTypes.INTEGER,

  });

  Category.associate = (models) => {
    Category.hasMany(models.Favorite, {
      foreignKey: 'cartId',
      onDelete: 'CASCADE',
      as: 'category',
    });

    Category.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'users',
    });
  };
  return Category;
};

