module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      sellerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sellerUser',
          key: 'id',
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tags: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      catagory: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      profilePic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isApproved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isDeleted: {
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
    await queryInterface.dropTable('product');
  },
};
