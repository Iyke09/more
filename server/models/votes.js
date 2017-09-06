

module.exports = (sequelize, DataTypes) => {
  const Votes = sequelize.define('Votes', {
    recipeId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    votes: DataTypes.BOOLEAN,
  });

  Votes.associate = (models) => {
    Votes.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      as: 'Votes',
    });
  };
  return Votes;
};


// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   var Category = sequelize.define('Category', {
//     userId: DataTypes.INTEGER,
//     cart_name: DataTypes.STRING,

//   });

//   Category.associate = (models) => {
//     Category.belongsTo(models.Favorite, {
//       foreignKey: 'cartId',
//       onDelete: 'CASCADE'
//     })

//     Category.belongsTo(models.User, {
//       foreignKey: 'userId',
//       as:'users'
//     })
//   };
//   return Category;
// };


// 'use strict';
// module.exports = {
//   up: (queryInterface, Sequelize) => {
//     return queryInterface.createTable('Categories', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       userId: {
//         type: Sequelize.INTEGER,
//         onDelete:'CASCADE',
//         allowNull: true,
//         references: {
//           model: 'Users',
//           key: 'id',
//           as:'category'
//         }
//       },
//       cart_name: {
//         type: Sequelize.STRING
//       },
//       favId: {
//         type: Sequelize.INTEGER
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       }
//     });
//   },
//   down: (queryInterface, Sequelize) => {
//     return queryInterface.dropTable('Categories');
//   }
// };
