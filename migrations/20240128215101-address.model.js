module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('address', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      addressLine1: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      addressLine2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      addressLine3: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cityID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'city',
          key: 'id',
        },
      },
      stateID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'state',
          key: 'id',
        },
      },
      countryID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'country',
          key: 'id',
        },
      },
      postalCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('address');
  },
};
