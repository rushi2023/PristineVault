module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admin', {
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
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profilePic: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      otp: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      tempEmail: {
        // this field is use to store the email while updating email
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('admin');
  },
};
