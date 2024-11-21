module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('city', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cityName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      countryID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'country',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      stateID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'state',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('city');
  },
};
