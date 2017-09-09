module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Comments', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    content: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    occupation: {
      type: Sequelize.STRING,
    },
    reply: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: ['great Dish!'],
    },
    recipeId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      allowNull: false,
      references: {
        model: 'Recipes',
        key: 'id',
        as: 'recipe',
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Comments'),
};
