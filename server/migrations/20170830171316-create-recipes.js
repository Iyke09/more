

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Recipes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    category: {
      type: Sequelize.STRING,
    },
    favUser: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: ['iykay33@gmail.com'],
    },
    instructions: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    ingredients: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    userId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
        as: 'user',
      },
    },
    upvote: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    downvote: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    views: {
      type: Sequelize.INTEGER,
      defaultValue: 0
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Recipes'),
};
