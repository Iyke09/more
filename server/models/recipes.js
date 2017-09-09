

module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define('Recipe', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: {
          args: 3,
          msg: `tile must start with a letter
            and be at least 3 characters.`
        },
        max: {
          args: 40,
          msg: `title must start with a letter,
            and be at less than 40 characters.`
        },
        is: {
          args: /^[a-zA-Z_ ]*$/,
          msg: 'only alphabets are allowed for the title'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: {
          args: 10,
          msg: `description must start be a letter
            and be at least 10 characters.`
        },
        max: {
          args: 250,
          msg: `description must start with a letter, have no spaces,
            and be at less than 250 characters.`
        }
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: {
          args: 3,
          msg: `category must start be a letter, have no spaces,
            and be at least 3 characters.`
        },
        max: {
          args: 10,
          msg: `category must start with a letter, have no spaces,
            and be at less than 10 characters.`
        },
        is: {
          args: /^[A-Za-z][A-Za-z]+$/i,
          msg: `category must start with a letter, have no spaces,
            and be 3 - 10 characters.`
        }
      }
    },
    userId: DataTypes.INTEGER,
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ingredients: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    instructions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
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
