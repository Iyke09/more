

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


//  'use strict';
// module.exports = (sequelize, DataTypes) => {
//   var Category = sequelize.define('Category', {
//     userId: DataTypes.INTEGER,
//     cart_name: DataTypes.STRING,
//     cartId:DataTypes.INTEGER,

//   });

//   Category.associate = (models) => {
//     Category.belongsTo(models.Favorite, {
//       foreignKey: 'cartId',
//       onDelete: 'CASCADE',
//       as: 'category'
//     })

//     Category.belongsTo(models.User, {
//       foreignKey: 'userId',
//       as:'users'
//     })
//   };
//   return Category;
// };
