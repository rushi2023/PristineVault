module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sellerUser', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      isApproved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE('-5:00'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE('-5:00'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sellerUser');
  },
};
